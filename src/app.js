// app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userroute from "./routes/user.route.js";
import promptroute from "./routes/prompt.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup for Vercel frontend + local dev
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://promptfrontend-two.vercel.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server or Postman requests
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies to be sent
  })
);

// ✅ Routes
app.use("/user", userroute);
app.use("/prompt", promptroute);

// Optional: simple health check
app.get("/", (req, res) => {
  res.json({ message: "PromptVault backend is running!" });
});

export default app;
