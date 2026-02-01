import OpenAI from "openai";

const CHAPTER_PROMPT = `You are a YouTube chaptering assistant.

Input: Raw YouTube captions (auto-generated or manual), including timestamps and text.

Task:

Analyze the captions to identify clear topic shifts and meaningful sections.

Generate concise, descriptive YouTube chapter titles (3–7 words each).

Output clean YouTube-style timestamps in ascending order (MM:SS or HH:MM:SS).

Merge or ignore filler, repeated phrases, and irrelevant captions.

Rules:

The first timestamp must always start at 00:00.

Use natural breakpoints based on topic changes, not every caption line.

Do not invent content not supported by the captions.

Output Format (only this):

00:00 - Introduction  
01:42 - Main topic overview  
05:18 - Step-by-step explanation  
09:50 - Common mistakes  
13:10 - Final tips & conclusion`;

export const analyze = async (captions: string) => {
  const openai = new OpenAI({ baseURL: "https://models.github.ai/inference",apiKey: process.env["GITHUB_TOKEN"] });
  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: CHAPTER_PROMPT },
      { role: "user", content: captions },
    ],
    temperature: 0.2,
  });
  const text = choices[0]?.message?.content?.trim() ?? "";
  return text;
};
