"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Mic,
  MicOff,
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
import Image from "next/image";

interface ChatTabProps {
  pdf: PdfData | null;
}

export function ChatTabRedux({ pdf }: ChatTabProps) {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isTyping, error } = useAppSelector(
    (state) => state.chat
  );

  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
      id: `temp-${Date.now()}`, // Temporary ID
      message_content: messageContent,
      message_type: "user" as const,
      message_order: messages.length + 1,
      timestamp: new Date().toISOString(), // Convert to ISO string
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
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
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-black/5 border-2 border-black/10 rounded-lg text-black">
          <p className="text-sm">Error: {error}</p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[600px]">
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
                Hi! I'm your AI assistant
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Ask me anything about your PDF document "{pdf?.file_name}". I'm
                here to help you understand and explore the content.
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
          <div className="space-y-4 max-w-4xl mx-auto">
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
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-2xl ${
                    message.message_type === "user"
                      ? "bg-black text-white rounded-xl rounded-br-sm"
                      : "bg-white border-2 border-black/5 rounded-xl rounded-bl-sm"
                  } px-4 py-3`}
                >
                  <p
                    className={`leading-relaxed whitespace-pre-wrap text-[15px] ${
                      message.message_type === "user"
                        ? "text-white"
                        : "text-black"
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
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border-2 border-black/5 rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-black/5 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {/* <button
              className="p-2.5 hover:bg-black/5 rounded-lg transition-colors border-2 border-black/5"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4 text-black/60" />
            </button> */}

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
                className="w-full px-4 py-2.5 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-black/10 disabled:opacity-50 disabled:bg-black/5 text-black placeholder-black/40 text-sm"
              />
            </div>
            {/* 
            <button
              onClick={toggleRecording}
              className={`p-2.5 rounded-lg transition-colors border-2 ${
                isRecording
                  ? "bg-black text-white border-black hover:bg-black/90"
                  : "text-black/60 hover:bg-black/5 border-black/5"
              }`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button> */}

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isLoading}
              className="p-2.5 bg-black hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg disabled:shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
