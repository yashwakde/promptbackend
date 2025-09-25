import jwt from "jsonwebtoken";
import usermodel from "../model/user.model.js";

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found."
            });
        }
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token."
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired."
            });
        }
        console.log("Auth middleware error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default authenticateToken;