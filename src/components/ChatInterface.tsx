"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatInterfaceProps {
    taskId: string;
    taskTitle: string;
    onClose: () => void;
}

export default function ChatInterface({ taskId, taskTitle, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId,
                    message: userMessage.content,
                    history: messages
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.body) throw new Error("No body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage: Message = { role: "assistant", content: "" };

            setMessages((prev) => [...prev, assistantMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                assistantMessage.content += text;

                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...assistantMessage };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "ごめんね、いまちょっと調子が悪いみたい。もう一度試してみてね。" }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-[500px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-sky-300">
            {/* Header */}
            <div className="bg-sky-500 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-full">
                        <Bot className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AI先生</h3>
                        <p className="text-xs opacity-90">{taskTitle} について質問中</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white font-bold"
                >
                    とじる
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sky-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <Sparkles className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                        <p className="font-bold">わからないことがあったらきいてね！</p>
                        <p className="text-sm">答えは教えないけど、ヒントをあげるよ。</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap ${msg.role === "user"
                                    ? "bg-blue-500 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border-2 border-sky-100 rounded-tl-none shadow-sm"
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border-2 border-sky-100 text-gray-400 text-sm">
                            考えているよ...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-sky-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ここに入力してね"
                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-gray-700 transition-all font-medium"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-sky-500 text-white p-3 rounded-xl hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 transition-colors shadow-sm"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
}
