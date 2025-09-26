import usermodel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendVerificationEmail } from "../utils/sendMail.js";

async function register(req, res) {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existinguser = await usermodel.findOne({ username });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // 6 digit numeric verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await usermodel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      isVerified: false,
      verificationCode
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Registration successful! Please verify your email.",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email address does not exist.",
      });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in."
      });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({
        message: "invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
      message: "user logged in successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
}

// Email verification controller
async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required." });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Verification failed." });
  }
}

async function profile(req,res){
  try {
    const user = await usermodel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
}


async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.status(200).json({
      message: "user logged out successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

export { register, login, profile, logout, verifyEmail };