import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userroute from "./routes/user.route.js";
import promptroute from "./routes/prompt.route.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/promptvault/user",userroute);
app.use("/promptvault/prompt",promptroute)
export default app;