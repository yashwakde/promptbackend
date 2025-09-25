import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userroute from "./routes/user.route.js";
import promptroute from "./routes/prompt.route.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    "https://promptfrontend-two.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));


app.use("/promptvault/user",userroute);
app.use("/promptvault/prompt",promptroute)
export default app;