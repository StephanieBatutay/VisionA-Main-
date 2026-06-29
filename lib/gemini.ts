import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export const PROMPTS: Record<string, string> = {
  academic: `Act as a university professor. Looking at this image, provide an academic-style analysis.

Respond ONLY with valid JSON in this exact shape, no extra text:

{
  "objects": ["...", "..."],
  "context": "Describe the educational context of the scene",
  "activities": "What learning or academic activity appears to be happening",
  "recommendations": "One piece of constructive academic feedback"
}`,

  safety: `Act as a workplace safety inspector. Looking at this image, identify any visible hazards, risks, or safety concerns. If none are visible, state that clearly.

Respond ONLY with valid JSON in this exact shape, no extra text:

{
  "objects": ["...", "..."],
  "context": "Describe the environment from a safety perspective",
  "activities": "What activities or behaviors are occurring that may pose risk",
  "recommendations": "Your top safety recommendation, or 'No hazards identified'"
}`,

  inventory: `Act as an asset management clerk. Looking at this image, list every visible physical asset as a clean inventory list, with no extra commentary.

Respond ONLY with valid JSON in this exact shape, no extra text:

{
  "objects": ["...", "..."],
  "context": "Location or area type where assets are stored",
  "activities": "Current state or condition of the assets",
  "recommendations": "Any asset management action required"
}`,
};

// Keep this exported so result.tsx can use it as a fallback
export const ANALYSIS_PROMPT = PROMPTS.academic;

export async function imageToBase64(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

export async function analyzeImage(
  base64Image: string,
  prompt: string = ANALYSIS_PROMPT,
) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.log("====================================");
    console.log("Gemini Status:", response.status);
    console.log("Gemini Error:", errorText);
    console.log("====================================");

    throw new Error(`Gemini API Error: ${response.status}`);
  }

  const json = await response.json();

  console.log("Gemini Success:", JSON.stringify(json, null, 2));

  return json;
}
