import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, X, Bot, User } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello! I'm Gemini (Flash 2.5). I can help you with text analysis, creative writing, and I can also see images. How can I help today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];
      
      if (userMsg.image) {
        // Extract base64 data (remove "data:image/png;base64," prefix)
        const base64Data = userMsg.image.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg' // Simplified for demo, usually detect from string
          }
        });
      }
      
      if (userMsg.text) {
        parts.push({ text: userMsg.text });
      }

      const streamResult = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: { parts: parts }
      });

      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add initial placeholder message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I encountered an error processing your request. Please check your network or API key." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-nexus-900">
      {/* Header */}
      <header className="h-16 border-b border-gray-700 flex items-center px-6 bg-nexus-900/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-white">Gemini 2.5 Flash</h2>
        <span className="ml-3 px-2 py-0.5 rounded-full bg-nexus-700 text-xs text-blue-200 border border-blue-500/20">Preview</span>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-nexus-accent' : 'bg-purple-600'}
            `}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`
              flex flex-col gap-2 max-w-[80%] 
              ${msg.role === 'user' ? 'items-end' : 'items-start'}
            `}>
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="User upload" 
                  className="max-w-[200px] md:max-w-sm rounded-lg border border-gray-600 shadow-md"
                />
              )}
              <div className={`
                p-4 rounded-2xl leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user' 
                  ? 'bg-nexus-accent text-white rounded-tr-sm' 
                  : 'bg-nexus-800 text-gray-100 rounded-tl-sm border border-gray-700'}
              `}>
                {msg.text || (isLoading && msg.role === 'model' && msg.id === messages[messages.length-1].id ? <span className="animate-pulse">Thinking...</span> : null)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-nexus-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {selectedImage && (
            <div className="flex items-center gap-2 p-2 bg-nexus-900 rounded-lg w-fit border border-gray-600 animate-in fade-in slide-in-from-bottom-2">
              <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded" />
              <span className="text-sm text-gray-300">Image attached</span>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white ml-2"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
              title="Add Image"
            >
              <ImageIcon size={24} />
            </button>
            
            <div className="flex-1 bg-nexus-900 border border-gray-600 rounded-xl focus-within:border-nexus-accent focus-within:ring-1 focus-within:ring-nexus-accent transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Gemini something..."
                className="w-full bg-transparent text-white p-3 max-h-32 min-h-[50px] resize-none focus:outline-none placeholder-gray-500"
                rows={1}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`
                p-3 rounded-xl transition-all duration-200
                ${(!input.trim() && !selectedImage) || isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-nexus-accent text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600'}
              `}
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};