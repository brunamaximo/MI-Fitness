
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutSheetData } from "../types";

export const generateWorkoutAI = async (goal: string, studentName: string): Promise<Partial<WorkoutSheetData> | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a comprehensive gym workout for the goal: "${goal}". 
                 The student name is "${studentName}". 
                 The workout should fit into a structured table format with groups, specific exercises, sets, reps and observations. 
                 Return strictly a JSON object matching the WorkoutSheetData structure.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warmup: { type: Type.STRING, description: "Cardio or warm-up instructions" },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  group: { type: Type.STRING },
                  order: { type: Type.STRING },
                  exercise: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  obs: { type: Type.STRING }
                },
                required: ["group", "order", "exercise", "sets", "reps"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating workout with Gemini:", error);
    return null;
  }
};
