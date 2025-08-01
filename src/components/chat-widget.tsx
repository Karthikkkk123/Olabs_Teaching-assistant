"use client";

import { contextualGreeting } from "@/ai/flows/contextual-greeting";
import { ragQuestionAnswering } from "@/ai/flows/rag-question-answering";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Bot, Globe, Loader2, MessageSquare, Send, User, X, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type Message = {
  role: "user" | "bot";
  content: string;
};

const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-primary"></span>
  </div>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"page" | "google">("page");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const getGreeting = async () => {
      setIsLoading(true);
      try {
        const webpageContent = document.body.innerText;
        const webpageUrl = window.location.href;
        const { greeting } = await contextualGreeting({
          webpageContent,
          webpageUrl,
        });
        setMessages([{ role: "bot", content: greeting }]);
      } catch (error) {
        console.error("Error fetching greeting:", error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to the AI assistant.",
        });
        setMessages([
          {
            role: "bot",
            content:
              "Hello! I seem to be having some trouble connecting. Please try again later.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getGreeting();
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const pageContent = document.body.innerText;
      const { answer } = await ragQuestionAnswering({
        question: currentInput,
        pageContent,
        mode: searchMode,
      });
      setMessages((prev) => [...prev, { role: "bot", content: answer }]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "I couldn't get a response. Please try again.",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-body">
      {isOpen && (
        <Card className="w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] sm:h-[600px] flex flex-col shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
              </div>
              <div>
                <CardTitle className="text-base font-headline">
                  Olabs AI Assist
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Online and ready to help
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "bot" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm prose dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      {message.content.split(/(\n| \[| \d\.)/).map((part, i) =>
                        /^(https?:\/\/)/.test(part) ? (
                          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            {part}
                          </a>
                        ) : (
                          part
                        )
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <LoadingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <div className="flex items-center space-x-2 self-center pb-2">
              <FileText className={`h-5 w-5 transition-colors ${searchMode === 'page' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="search-mode" className="sr-only">Search Mode</Label>
              <Switch
                id="search-mode"
                checked={searchMode === 'google'}
                onCheckedChange={(checked) => setSearchMode(checked ? 'google' : 'page')}
              />
              <Globe className={`h-5 w-5 transition-colors ${searchMode === 'google' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="flex w-full items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={searchMode === 'page' ? "Ask about this page..." : "Ask Google..."}
                autoComplete="off"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label="Toggle Chat"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
          color: "hsl(var(--primary-foreground))",
        }}
      >
        {isOpen ? (
          <X className="h-8 w-8" />
        ) : (
          <MessageSquare className="h-8 w-8" />
        )}
      </Button>
    </div>
  );
}
