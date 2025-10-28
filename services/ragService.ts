
import type { MedicalContext } from '../types';

// A simple list of common English stop words.
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

/**
 * Tokenizes a string into an array of words, filtering out stop words.
 * @param text The input string.
 * @returns An array of meaningful words.
 */
function getTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Retrieves the most relevant contexts for a given query using simple keyword matching.
 * @param query The user's question.
 * @param contexts The list of all available medical contexts.
 * @param topK The number of top contexts to return.
 * @returns An array of the most relevant contexts.
 */
export function retrieveContexts(query: string, contexts: MedicalContext[], topK: number = 3): MedicalContext[] {
  const queryTokens = new Set(getTokens(query));

  if (queryTokens.size === 0) {
    return contexts.slice(0, topK); // Return topK if query is only stop words
  }

  const scoredContexts = contexts.map(context => {
    const contextTokens = getTokens(context.content);
    const score = contextTokens.reduce((acc, token) => {
      return acc + (queryTokens.has(token) ? 1 : 0);
    }, 0);
    return { ...context, score };
  });

  scoredContexts.sort((a, b) => b.score - a.score);

  // Filter out contexts with a score of 0, unless that would result in an empty list
  const relevantContexts = scoredContexts.filter(c => c.score > 0);
  
  if (relevantContexts.length > 0) {
      return relevantContexts.slice(0, topK);
  }

  // Fallback: if no contexts have any matching keywords, return the first few contexts
  // to avoid sending an empty context list to the AI.
  return scoredContexts.slice(0, topK);
}
