
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BotMessageContent, Message } from './types';
import { fetchMedicalAnswer } from './services/geminiService';

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM8.25 12a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const UserMessage: React.FC<{ content: string }> = ({ content }) => (
    <div className="flex items-start gap-3 justify-end">
        <div className="bg-blue-600 text-white p-3 rounded-lg max-w-lg">
            <p>{content}</p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <UserIcon />
        </div>
    </div>
);

const BotMessage: React.FC<{ content: BotMessageContent }> = ({ content }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <BotIcon />
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-lg w-full">
            <h3 className="font-semibold text-slate-800 mb-2">Answer</h3>
            <p className="text-slate-700 mb-4">{content.answer}</p>
            <h4 className="font-semibold text-slate-800 mb-2 border-t pt-3">Supporting Contexts</h4>
            <div className="space-y-2">
                {content.contexts.map((ctx, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-md border border-slate-200">
                        <p className="text-sm text-slate-600 italic">"{ctx}"</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ErrorMessage: React.FC<{ content: string }> = ({ content }) => (
    <div className="flex justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{content}</span>
        </div>
    </div>
);

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseContent = await fetchMedicalAnswer(userMessage.content as string);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: botResponseContent,
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'error',
                content: (error as Error).message,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-slate-50 shadow-2xl">
            <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-slate-800">RAG Medical Chatbot</h1>
                <p className="text-sm text-slate-500">Your trusted source for evidence-based medical information.</p>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <BotIcon />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-lg w-full">
                        <p className="text-slate-700">Hello! Please ask a medical question. I will answer based only on the information from my trusted medical sources.</p>
                        <p className="text-sm text-slate-500 mt-2">Example: "How often should adults get a Tdap booster?"</p>
                    </div>
                </div>

                {messages.map(msg => {
                    if (msg.role === 'user') {
                        return <UserMessage key={msg.id} content={msg.content as string} />;
                    }
                    if (msg.role === 'bot') {
                        return <BotMessage key={msg.id} content={msg.content as BotMessageContent} />;
                    }
                    if (msg.role === 'error') {
                        return <ErrorMessage key={msg.id} content={msg.content as string} />;
                    }
                    return null;
                })}

                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <BotIcon />
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-lg w-full flex items-center space-x-2">
                             <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                             <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                             <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>

            <footer className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e as any);
                            }
                        }}
                        placeholder="Ask a medical question..."
                        className="flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-blue-600 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
}
