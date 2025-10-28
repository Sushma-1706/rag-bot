
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MEDICAL_CONTEXTS } from '../constants';
import { BotMessageContent } from '../types';
import { retrieveContexts } from './ragService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function fetchMedicalAnswer(query: string): Promise<BotMessageContent> {
  // 1. Retrieve the most relevant contexts based on the user's query.
  const relevantContexts = retrieveContexts(query, MEDICAL_CONTEXTS, 3);

  // 2. Format the retrieved contexts into a string for the prompt.
  const formattedContexts = relevantContexts
    .map(c => `[${c.id}]\nTopic: ${c.topic}\nSource: ${c.source}\nContent: "${c.content}"`)
    .join('\n\n');

  // 3. Construct the full prompt with only the relevant, retrieved contexts.
  const fullPrompt = `
${SYSTEM_PROMPT}

----------------------
RETRIEVED MEDICAL DATASET CONTEXTS:
${formattedContexts}

----------------------
USER QUERY:
"${query}"

Begin acting under these rules now. Output only the required JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    const textResponse = response.text.trim();
    
    // Clean potential markdown fences
    const jsonString = textResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    const parsedResponse: BotMessageContent = JSON.parse(jsonString);

    if (!parsedResponse.answer || !Array.isArray(parsedResponse.contexts)) {
        throw new Error("Invalid JSON structure from API.");
    }

    return parsedResponse;

  } catch (error) {
    console.error("Error fetching or parsing medical answer:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. Please try again.");
    }
    throw new Error("An error occurred while communicating with the AI. Please check the console for details.");
  }
}
