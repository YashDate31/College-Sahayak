import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_URL } from '../utils/api';
import './Chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am College Mitra, your AI academic and career counselor. How can I help you with your studies or MSBTE curriculum today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Optimistically add user message
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        setIsLoading(false);
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my servers right now." }]);
        return;
      }

      setIsLoading(false);
      // Create empty message for assistant
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  assistantContent += parsed.text;
                  
                  // Filter out the internal <think>...</think> block from Qwen models
                  let displayContent = assistantContent.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
                  
                  // Provide a visual cue while thinking
                  if (assistantContent.includes('<think>') && !assistantContent.includes('</think>')) {
                    displayContent = "🤔 *College Mitra is thinking...*\n\n" + displayContent;
                  }

                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = displayContent || '...';
                    return updated;
                  });
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please check your network." }]);
    }
  };

  return (
    <>
      <button 
        className={`chatbot-trigger ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat assistant"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="chatbot-window animate-fade-in-up">
          <div className="chatbot-header">
            <div className="chatbot-brand">
              <Bot size={24} />
              <div>
                <h3>College Mitra</h3>
                <span className="status-online">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  {msg.role === 'assistant' ? <Bot size={14} className="message-icon" /> : <User size={14} className="message-icon" />}
                  <div className="message-content">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble">
                  <Bot size={14} className="message-icon" />
                  <div className="message-content">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
