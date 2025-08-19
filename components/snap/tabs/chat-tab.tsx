"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Copy,
  Sparkles,
  Brain,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  fetchMessages,
  sendMessage,
  setCurrentPdf,
  clearError,
  addUserMessage,
} from "@/store/slices/chatSlice";
import type { PdfData } from "@/constants/index";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChatLoader } from "@/components/ChatLoader";

interface ChatTabProps {
  pdf: PdfData | null;
}

export function ChatTabRedux({ pdf }: ChatTabProps) {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isTyping, error } = useAppSelector(
    (state) => state.chat
  );

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (pdf?.id) {
      dispatch(setCurrentPdf(pdf.id));
      dispatch(fetchMessages(pdf.id));
    }
  }, [pdf?.id, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !pdf?.id) return;

    const messageContent = inputMessage;
    setInputMessage("");

    // Create temporary user message to show immediately
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      message_content: messageContent,
      message_type: "user" as const,
      message_order: messages.length + 1,
      timestamp: new Date(),
      pdfId: pdf.id,
    };

    // Add user message immediately to show it right away
    dispatch(addUserMessage(tempUserMessage));

    try {
      await dispatch(
        sendMessage({
          content: messageContent,
          pdfId: pdf.id,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally remove the temp message on error
      // You could add a removeMessage action if needed
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const suggestedQuestions = pdf
    ? [
        {
          title: "Document Overview",
          question: `What can you tell me about ${pdf.file_name}?`,
        },
        {
          title: "Key Insights",
          question: "What are the main points or insights from this document?",
        },
        {
          title: "Summary",
          question: "Can you provide a summary of this document?",
        },
        {
          title: "Content Analysis",
          question: "What topics does this document cover?",
        },
      ]
    : [];

  // Create a sorted copy of messages to avoid mutating the original array
  const sortedMessages = [...messages].sort(
    (a, b) => a.message_order - b.message_order
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-white/50 fixed inset-0  z-50">
        <div className="text-center flex items-center justify-center">
          <DotLottieReact
            src='/animations/message-loading.json'
            loop={true}
            autoplay={true}
            style={{ width: "120px", height: "120px" }}
          />
          <p className="text-slate-600 font-medium mt-4">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Error Display */}
      {error && (
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
          <div className="mt-4 p-4 bg-black/5 border-2 border-black/10 rounded-lg text-black">
            <p className="text-sm">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Messages Area - Scrollable Container */}
      <div className="flex-1 overflow-y-auto mb-[80px]">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
          {sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
              </div>

              <div className="text-center max-w-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Hi! I&apos;m your AI assistant
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Ask me anything about your PDF document &quot;
                  {pdf?.file_name}&quot;. I&apos;m here to help you understand
                  and explore the content.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(item.question)}
                    className="p-4 bg-white hover:bg-black/5 rounded-lg border-2 border-black/5 text-left transition-all duration-200 hover:border-black/10 group"
                  >
                    <div className="font-semibold text-black mb-1 group-hover:text-black">
                      {item.title}
                    </div>
                    <div className="text-black/60 text-sm leading-relaxed">
                      {item.question}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.message_type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  
                  {message.message_type === "ai" && (
                    <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl ${
                      message.message_type === "user"
                        ? "bg-[#1A1A1A] text-white  rounded-xl rounded-br-sm"
                        : "bg-white/80 border-2 border-black/5 rounded-xl rounded-bl-sm"
                    } px-4 py-3 tracking-wide`}
                  >
                    <p
                      className={`leading-relaxed whitespace-pre-wrap text-[15px] ${
                        message.message_type === "user"
                          ? "text-white font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {message.message_content}
                    </p>

                    {message.message_type === "ai" && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-black/5">
                        <button
                          onClick={() => copyMessage(message.message_content)}
                          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-4 h-4 text-black/60" />
                        </button>
                        <span className="text-xs text-black/40 ml-auto">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {message.message_type === "user" && (
                    <div className="w-8 h-8 bg-black/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  
                  <ChatLoader />
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5">
        <div className="lg:ml-[20%] xl:ml-[20%] 2xl:ml-[20%]">
          <div className="max-w-3xl mx-auto w-full">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask me anything about ${
                      pdf?.file_name || "this PDF"
                    }...`}
                    disabled={isTyping || isLoading}
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-xl focus:outline-none focus:border-black/20 disabled:opacity-50 disabled:bg-black/5 text-black placeholder-black/40 text-sm transition-colors duration-200 shadow-sm"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping || isLoading}
                  className="p-3 bg-black hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-500 shadow-md disabled:shadow-sm flex-shrink-0"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
