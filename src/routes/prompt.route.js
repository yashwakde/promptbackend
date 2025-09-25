import express from "express";
import { allprompt, createprompt, myprompts } from "../controller/prompt.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/createprompt",authenticateToken,createprompt);
router.get("/allprompts",allprompt);
router.get("/myprompts/:id",authenticateToken,myprompts);
export default router;