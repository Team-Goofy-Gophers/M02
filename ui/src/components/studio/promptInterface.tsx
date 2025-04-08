"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Send,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    content:
      "Extract all invoice numbers, dates, and amounts from these documents.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    role: "assistant",
    content:
      "I've extracted the invoice data from your documents. Here's a table with invoice numbers, dates, and amounts for all 4 invoices. Would you like me to add any additional fields to this dataset?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: 3,
    role: "user",
    content: "Add customer names and payment status.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: 4,
    role: "assistant",
    content:
      "I've updated the dataset to include customer names and payment status for each invoice. The data has been extracted with high confidence (>95%). You can now view and edit the full dataset in the Dataset tab.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

const suggestions = [
  "Show me a summary of total invoice amounts by customer",
  "Extract payment terms from these invoices",
  "Create a chart showing invoice amounts by date",
  "Find all overdue invoices",
];

const PromptInterface = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content:
            "I'm processing your request to analyze the invoice data. This might take a moment...",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="border-t bg-white">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-4 w-4" />
              Hide Chat History
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Chat History
            </>
          )}
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      {isExpanded && (
        <ScrollArea className="h-64">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="AI"
                    />
                    <AvatarFallback>
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="mb-1 text-sm">{message.content}</div>
                  <div className="text-right text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto py-1 text-xs"
              onClick={() => setInputValue(suggestion)}
            >
              <Lightbulb className="mr-1 h-3 w-3" />
              {suggestion}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask a question or give instructions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInterface;
