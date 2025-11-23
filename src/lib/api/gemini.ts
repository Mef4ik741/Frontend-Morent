import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_CARS } from "../../mocks/cars";

// Initialize Gemini Client
// Using VITE_GEMINI_API_KEY as per Vite convention
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getCarRecommendations = async (userQuery: string): Promise<{ text: string; carIds: string[] }> => {
  try {
    // Construct a simplified inventory string to save tokens and give context
    const inventoryContext = MOCK_CARS.map(c =>
      `ID: ${c.id}, Make: ${c.make}, Model: ${c.model}, Type: ${c.type}, Price: $${c.pricePerDay}, Location: ${c.location}, Features: ${c.features.join(', ')}`
    ).join('\n');

    const systemInstruction = `
      You are a helpful concierge for Morent, a car rental platform.
      Your goal is to help users find the perfect car from our inventory.
      
      Here is our current inventory:
      ${inventoryContext}

      When a user asks for a recommendation:
      1. Analyze their needs (budget, location, passengers, style).
      2. Recommend 1-3 cars from the inventory that best match.
      3. Return a JSON object with a friendly message explaining why you chose them, and an array of matching Car IDs.
      
      If no specific car matches perfectly, suggest the closest alternatives.
      Keep the message concise and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            recommendedCarIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["message", "recommendedCarIds"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        text: data.message,
        carIds: data.recommendedCarIds || []
      };
    }

    return { text: "I'm sorry, I couldn't process that request right now.", carIds: [] };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the service. Please try browsing our catalog manually.", carIds: [] };
  }
};
