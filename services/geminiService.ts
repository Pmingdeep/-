import { GoogleGenAI, Type } from "@google/genai";
import { EventType } from '../types';

const apiKey = process.env.API_KEY; // Assumes environment variable is set

// Schema definition for the AI response
const scheduleSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      type: { type: Type.STRING, enum: Object.values(EventType) },
      startTime: { type: Type.STRING, description: "ISO 8601 Date string, assume current year/month if not specified, relative to now." },
      endTime: { type: Type.STRING, description: "ISO 8601 Date string" },
      location: { type: Type.STRING },
      description: { type: Type.STRING }
    },
    required: ["title", "type", "startTime", "endTime", "location"]
  }
};

export const generateSmartSchedule = async (prompt: string, userContext: string): Promise<any[]> => {
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("请配置 API Key 以使用智能生成功能");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const fullPrompt = `
    User Context: ${userContext}
    Current Date: ${new Date().toISOString()}
    
    Task: Create a realistic schedule based on the user request: "${prompt}".
    Generate at least 3-5 events if the prompt implies a full day or list.
    Ensure dates are in the future relative to Current Date unless specified otherwise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scheduleSchema,
        systemInstruction: "You are a helpful schedule assistant. You generate realistic itinerary data for a database application.",
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};