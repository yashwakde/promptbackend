import promptModel from "../model/prompt.model.js";
import { generateTag } from "../service/ai.service.js";

// Create a new prompt
async function createprompt(req, res) {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({
                message: "Title and Description are required"
            });
        }
        const tag = await generateTag(title, description);
        const prompt = await promptModel.create({
            title,
            description,
            tag,
            user: req.user.id
        });
        return res.status(201).json({
            message: "Prompt created successfully",
            prompt: {
                id: prompt._id,
                title: prompt.title,
                description: prompt.description,
                tag: prompt.tag,
                user: prompt.user,
                createdAt: prompt.createdAt
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create prompt" });
    }
}


//all prompts
async function allprompt(req, res) {
    try {
        const prompts = await promptModel.find().populate({
            path: 'user',
            select: 'username'
        });
        const result = prompts.map(p => ({
            id: p._id,
            username: p.user?.username || null,
            tag: p.tag,
            title: p.title,
            description: p.description,
            createdAt: p.createdAt
        }));
        return res.status(200).json({
            message: "All prompts fetched successfully",
            prompts: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch prompts" });
    }
}

async function myprompts(req, res) {
    try {
        const prompts = await promptModel.find({ user: req.params.id }).populate({
            path: 'user',
            select: 'username'
        });
        const result = prompts.map(p => ({
            id: p._id,
            username: p.user?.username || null,
            tag: p.tag,
            title: p.title,
            description: p.description,
            createdAt: p.createdAt
        }));
        return res.status(200).json({
            message: "User prompts fetched successfully",
            prompts: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch user prompts" });
    }
}
export { createprompt ,allprompt,myprompts};
