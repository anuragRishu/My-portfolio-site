
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
  async generateProjectPitch(projectTitle: string, category: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional portfolio description for a video project titled "${projectTitle}" in the ${category} category. Include a pitch and 3-5 technical tags.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              pitch: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['hook', 'pitch', 'tags']
          }
        }
      });
      return response.text ? JSON.parse(response.text) : null;
    } catch (e) {
      console.error("Gemini Error:", e);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
