import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { doubtService } from '../services/doubtService';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp?: string;
}

const DoubtSolver: React.FC = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'ai',
            content: 'Hi! I am your AI study assistant. Ask me any doubt related to your subjects or exams.'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load history
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await doubtService.getHistory();
                // Convert history to messages format
                const historyMessages: Message[] = history.flatMap(d => [
                    { id: d.id + '-q', role: 'user', content: d.question, timestamp: d.askedAt },
                    { id: d.id + '-a', role: 'ai', content: d.aiResponse, timestamp: d.askedAt }
                ]);

                if (historyMessages.length > 0) {
                    setMessages(prev => [...prev, ...historyMessages]);
                }
            } catch (error) {
                console.error('Failed to load history:', error);
            }
        };
        loadHistory();
    }, []);

    const handleSend = async () => {
        if (!query.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const response = await doubtService.askDoubt(userMsg.content);
            const aiMsg: Message = {
                id: response.id,
                role: 'ai',
                content: response.aiResponse,
                timestamp: response.askedAt
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            const errorMsg: Message = {
                id: 'error-' + Date.now(),
                role: 'ai',
                content: 'Sorry, I encountered an error processing your request. Please try again.'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center">
                    <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-white/20">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Doubt Solver AI</h2>
                        <p className="text-xs text-indigo-100">Always here to help you learn</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`
                                flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm mt-1
                                ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-500 ml-2'
                                    : 'bg-white border border-gray-200 mr-2'}
                            `}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                            </div>
                            <div className={`
                                px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'}
                            `}>
                                {msg.content}
                                {msg.timestamp && (
                                    <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white border border-gray-200 mr-2 flex items-center justify-center shadow-sm">
                                <Bot className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your doubt here..."
                        disabled={loading}
                        className="w-full pl-5 pr-14 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all duration-200"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !query.trim()}
                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoubtSolver;
