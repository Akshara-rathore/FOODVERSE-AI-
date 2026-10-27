import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  MessageSquare,
  Flame,
  Apple
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { Conversation, ChatMessage } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const AssistantPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !activeConvId) {
        selectConversation(list[0].id);
      }
    } catch {
      // ignore
    }
  };

  const selectConversation = async (id: number) => {
    setActiveConvId(id);
    try {
      const conv = await api.getConversationById(id);
      setMessages(conv.messages || []);
    } catch {
      // ignore
    }
  };

  const handleStartNewChat = () => {
    setActiveConvId(undefined);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(id);
      if (activeConvId === id) {
        handleStartNewChat();
      }
      loadConversations();
    } catch {
      // ignore
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');
    setError(null);

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      conversation_id: activeConvId || 0,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const reply = await api.sendChatMessage(text, activeConvId);
      setActiveConvId(reply.conversation_id);
      setMessages((prev) => [...prev, reply]);
      loadConversations();

      // Text to speech playback if enabled
      if (ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply.content.replace(/[*#]/g, ''));
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to receive response from FoodVerse AI.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'How long does cooked salmon remain safe in the refrigerator?',
    'What are 5 nutrient-dense plant proteins for muscle recovery?',
    'Healthy substitute for heavy cream in tomato pasta sauce',
    'What internal temperature destroys Salmonella in poultry?',
  ];

  return (
    <DashboardLayout
      title="Multimodal AI Assistant"
      description="Engage in real-time culinary dialogue, macro coaching, allergen substitutions, and kitchen hygiene best practices."
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[500px]">
          {/* Left Column: Conversations Drawer */}
          <div className="hidden lg:flex lg:col-span-4 flex-col bg-surface border border-border rounded-xl p-4 shadow-subtle overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText">
                Conversations
              </span>
              <Button variant="secondary" size="sm" onClick={handleStartNewChat} icon={<Plus className="w-3.5 h-3.5" />}>
                New Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pt-3">
              {conversations.length > 0 ? (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      activeConvId === c.id
                        ? 'bg-primary-light/50 border border-primary/20 text-primary font-semibold'
                        : 'hover:bg-background text-mainText border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      className="text-secondaryText hover:text-coral p-1 rounded transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-secondaryText text-center py-8">
                  No active conversations yet. Start a new dialogue below!
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Chat Stream */}
          <div className="lg:col-span-8 flex flex-col bg-surface border border-border rounded-xl shadow-subtle overflow-hidden">
            {/* Top Toolbar */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-surface">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4 text-coral" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-mainText">
                    FoodVerse AI Assistant
                  </h3>
                  <p className="text-[10px] text-secondaryText">Culinary Intelligence & Nutrition Guide</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    ttsEnabled
                      ? 'bg-primary-light text-primary border-primary/30'
                      : 'bg-white text-secondaryText border-border hover:bg-gray-50'
                  }`}
                  title={ttsEnabled ? 'Voice output enabled' : 'Voice output disabled'}
                >
                  {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline text-[11px]">{ttsEnabled ? 'Audio On' : 'Audio Off'}</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-background/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-coral" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-mainText">How can FoodVerse help you today?</h4>
                  <p className="text-xs text-secondaryText max-w-sm">
                    Ask questions about meal prep, macros, ingredient replacements, food preservation, or kitchen hygiene guidelines.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md pt-2">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-left text-xs p-2.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:bg-primary-light/20 text-mainText transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-primary text-white rounded-br-none shadow-sm'
                            : 'bg-surface border border-border text-mainText rounded-bl-none shadow-subtle'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div
                          className={`text-[10px] mt-1.5 ${
                            isUser ? 'text-white/70 text-right' : 'text-secondaryText'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {isUser && (
                        <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {loading && (
                <div className="flex gap-3 mr-auto items-center text-secondaryText text-xs">
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span>FoodVerse AI is evaluating culinary knowledge...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask any food, nutrition, recipe, or hygiene question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading}
                  className="flex-1 h-10 px-3.5 rounded-lg border border-border bg-background text-xs sm:text-sm text-mainText focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!inputMessage.trim() || loading}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
