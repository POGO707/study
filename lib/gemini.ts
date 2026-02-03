const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1/models";

export async function generateContent(model: string, prompt: string) {
    const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Gemini API failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

export const models = {
    pro: "gemini-pro",
    vision: "gemini-pro-vision",
};
