import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY,
});

export async function generateTag(title, description) {
  const prompt = `Suggest a single-word tag for this prompt in hashtag format (like #education):\nTitle: ${title}\nDescription: ${description}`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  let tag = response.text || response.choices?.[0]?.text || "general";
  tag = tag.trim();
  if (!tag.startsWith("#")) {
    tag = "#" + tag.replace(/\s+/g, "");
  }
  return tag;
}