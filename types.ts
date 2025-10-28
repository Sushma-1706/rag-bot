
export interface BotMessageContent {
  answer: string;
  contexts: string[];
}

export type Message = {
  id: string;
  role: 'user' | 'bot' | 'error';
  content: string | BotMessageContent;
};

export interface MedicalContext {
  id: string;
  topic: string;
  source: string;
  content: string;
}
