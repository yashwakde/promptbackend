import usermodel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
async function register(req, res) {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await usermodel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB (no email verification)
    const user = await usermodel.create({
      username,
      email,
      phone,
      password: hashedPassword,
      isVerified: true, // mark verified directly
      // verificationCode: undefined // no code needed
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.error("Registration error:", err.message, err.stack);
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email address does not exist." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User logged in successfully." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
}

// PROFILE
async function profile(req, res) {
  try {
    const user = await usermodel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
}

// LOGOUT
async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { register, login, profile, logout };
