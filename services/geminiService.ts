import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

// NOTE: In a production app, never expose API keys on the client side.
// This is for demonstration purposes within the isolated environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a fun, random trivia question about general knowledge, science, or pop culture. Provide 4 options and the index of the correct answer.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctIndex: { type: Type.INTEGER, description: "0-based index of the correct option" }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    // Fallback question if API fails or key is missing
    return {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctIndex: 1
    };
  }
};