import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Message, ChatWidgetConfig, StreamingChunk } from "../types";

interface ChatWidgetContextType {
  // Configuration
  theme: "light" | "dark";
  brandColor: string;
  position: "bottom-right" | "bottom-left";
  placeholder: string;
  welcomeMessage: string;
  apiEndpoint: string;
  allowFullscreen: boolean;

  // State
  messages: Message[];
  isConnected: boolean;
  hasUnread: boolean;
  isLoading: boolean;
  connectionStatus: "connected" | "disconnected" | "reconnecting";
  queuedMessages: string[];
  isFullscreen: boolean;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  cancelMessage: (messageId: string) => void;
  markAsRead: () => void;
  clearMessages: () => void;
  startNewConversation: () => void;
  toggleFullscreen: () => void;
}

interface RetryableError {
  canRetry: boolean;
  shouldRetry: boolean;
  retryAfter?: number;
}

const isRetryableError = (error: any): RetryableError => {
  // Network errors (fetch failures)
  if (error instanceof TypeError || error.name === 'TypeError') {
    return { canRetry: true, shouldRetry: true };
  }
  
  // AbortError from timeout
  if (error.name === 'AbortError') {
    return { canRetry: true, shouldRetry: true };
  }
  
  // HTTP errors
  if (error instanceof Response || (error.status && typeof error.status === 'number')) {
    const status = error.status || error.response?.status;
    
    if (status >= 500) {
      return { canRetry: true, shouldRetry: true };
    }
    
    if (status === 429) {
      const retryAfter = error.headers?.get?.('retry-after') || 5;
      return { canRetry: true, shouldRetry: true, retryAfter: parseInt(retryAfter) * 1000 };
    }
    
    if (status >= 400 && status < 500) {
      return { canRetry: true, shouldRetry: false }; // Client errors - show retry button but don't auto-retry
    }
  }
  
  return { canRetry: false, shouldRetry: false };
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRetryDelay = (attempt: number, baseDelay = 1000) => {
  return Math.min(baseDelay * Math.pow(2, attempt), 10000); // Cap at 10 seconds
};

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

interface ChatWidgetProviderProps {
  children: React.ReactNode;
  config: ChatWidgetConfig;
}

export const ChatWidgetProvider: React.FC<ChatWidgetProviderProps> = ({ children, config }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("disconnected");
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Add polling mechanism for incomplete messages
  const pollForCompletion = useCallback(async (messageId: string) => {
    const maxPolls = 10;
    let polls = 0;
    
    while (polls < maxPolls) {
      try {
        const response = await fetch(`${config.apiEndpoint}/chat/conversations/${conversationId}/messages/${messageId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (response.ok) {
          const messageData = await response.json();
          if (messageData.status === 'completed') {
            setMessages(prev => prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: messageData.content, status: 'completed', streaming: false }
                : msg
            ));
            return;
          }
        }
      } catch (error) {
        console.warn("Polling failed:", error);
      }
      
      polls++;
      await sleep(3000); // Poll every 3 seconds
    }
  }, [config.apiEndpoint, conversationId]);

  // Add recovery mechanism for background-processed requests
  const checkForBackgroundCompletion = useCallback(async (messageId: string) => {
    try {
      const response = await fetch(`${config.apiEndpoint}/chat/conversations/${conversationId}/messages/${messageId}/status`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'completed' && data.content) {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: data.content, 
                  status: 'completed', 
                  streaming: false,
                  chunks: data.chunks || {}
                }
              : msg
          ));
          return true;
        }
      }
    } catch (error) {
      console.warn("Background completion check failed:", error);
    }
    return false;
  }, [config.apiEndpoint, conversationId]);

  // Initialize conversation ID and load messages on mount
  useEffect(() => {
    const initializeConversation = () => {
      let storedId = localStorage.getItem("chat-widget-conversation-id");
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("chat-widget-conversation-id", storedId);
      }
      setConversationId(storedId);
      
      // Load stored messages
      const storedMessages = localStorage.getItem("chat-widget-messages");
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error("Failed to parse stored messages:", error);
          localStorage.removeItem("chat-widget-messages");
        }
      }
      
      setIsLoading(false);
    };

    initializeConversation();
  }, []);

  // Health check function
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiEndpoint}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      
      const wasConnected = isConnected;
      const nowConnected = response.ok;
      
      setIsConnected(nowConnected);
      setConnectionStatus(nowConnected ? "connected" : "disconnected");
      
      // Check for incomplete streaming messages on reconnect
      if (!wasConnected && nowConnected) {
        const incompleteMessages = messages.filter(msg => 
          msg.streaming || msg.status === 'sending' || msg.status === 'retrying'
        );
        
        for (const msg of incompleteMessages) {
          pollForCompletion(msg.id);
        }
        
        // Process queued messages
        if (queuedMessages.length > 0) {
          const messagesToProcess = [...queuedMessages];
          setQueuedMessages([]);
          
          for (const message of messagesToProcess) {
            await sendMessage(message);
          }
        }
      }
      
      return nowConnected;
    } catch (error) {
      console.error("Health check failed:", error);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      return false;
    }
  }, [config.apiEndpoint, isConnected, queuedMessages, messages, pollForCompletion]);

  // Start periodic health checks
  useEffect(() => {
    console.log('🏥 Setting up health check interval');
    
    // Clear any existing interval first
    if (healthCheckIntervalRef.current) {
      console.log('🧹 Clearing existing health check interval');
      clearInterval(healthCheckIntervalRef.current);
    }
    
    checkConnection(); // Initial check
    
    healthCheckIntervalRef.current = setInterval(() => {
      console.log('🏥 Running scheduled health check');
      checkConnection();
    }, 10000); // Increase to 10 seconds to reduce spam
    
    return () => {
      console.log('🧹 Cleaning up health check interval');
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, []); // Remove checkConnection from dependencies to prevent recreation

  const sendMessageWithRetry = useCallback(
    async (content: string, messageId: string, maxRetries = 3): Promise<void> => {
      console.log(`🚀 Starting request for messageId: ${messageId}`);
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const abortController = new AbortController();
          abortControllersRef.current.set(messageId, abortController);
          
          // Log when abort signal changes
          abortController.signal.addEventListener('abort', () => {
            console.log(`⚠️ AbortController aborted for messageId: ${messageId}`, {
              reason: abortController.signal.reason,
              stack: new Error().stack
            });
          });

          console.log(`📡 Making fetch request for messageId: ${messageId}, attempt: ${attempt + 1}`);
          
          const history = messages
            .filter((msg) => !msg.streaming && msg.status !== "failed")
            .map((msg) => ({ role: msg.role, content: msg.content }));

          const response = await fetch(`${config.apiEndpoint}/chat/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, history }),
            signal: abortController.signal, // Only for user cancellation
          });

          console.log(`✅ Fetch successful for messageId: ${messageId}`);
          
          // Success - handle streaming response
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body reader available");
          }

          const decoder = new TextDecoder();
          let buffer = "";
          let hasReceivedContent = false;

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.success && data.message) {
                      hasReceivedContent = true;
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === messageId
                            ? {
                                ...msg,
                                content: data.message,
                                status: "streaming",
                                chunks: {
                                  ...msg.chunks,
                                  message: data.message,
                                  plan: data.plan,
                                  code: data.code,
                                },
                              }
                            : msg
                        )
                      );
                    }
                  } catch (e) {
                    console.error("Failed to parse SSE data:", e);
                  }
                }
              }
            }
          } catch (streamError) {
            console.warn("Stream interrupted:", streamError);
            
            // Mark as processing in background
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { 
                      ...msg, 
                      content: "Processing your request in the background...", 
                      status: "streaming",
                      streaming: true 
                    }
                  : msg
              )
            );
            
            // Start polling for background completion
            const pollInterval = setInterval(async () => {
              const completed = await checkForBackgroundCompletion(messageId);
              if (completed) {
                clearInterval(pollInterval);
              }
            }, 5000);
            
            // Stop polling after 10 minutes
            setTimeout(() => clearInterval(pollInterval), 600000);
            
            return; // Don't throw error
          }

          // Mark as complete
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, streaming: false, status: "completed" }
                : msg
            )
          );
          
          return; // Success, exit retry loop
          
        } catch (error) {
          console.log(`❌ Request failed for messageId: ${messageId}:`, {
            errorName: error.name,
            errorMessage: error.message,
            isAbortError: error.name === 'AbortError',
            signalAborted: abortControllersRef.current.get(messageId)?.signal.aborted
          });
          
          abortControllersRef.current.delete(messageId);
          
          // Only retry on network errors, not user cancellations
          if (error.name === 'AbortError') {
            console.log(`Request aborted for message ${messageId}`);
            return; // Don't retry aborted requests
          }
          
          const errorInfo = isRetryableError(error);
          
          if (attempt === maxRetries - 1 || !errorInfo.shouldRetry) {
            // Final failure
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      content: getErrorMessage(error, errorInfo),
                      streaming: false,
                      status: "failed",
                      canRetry: errorInfo.canRetry,
                      originalContent: content,
                    }
                  : msg
              )
            );
            throw error;
          }
          
          // Wait for retry-after header if present
          if (errorInfo.retryAfter) {
            await sleep(errorInfo.retryAfter);
          }
        }
      }
    },
    [config.apiEndpoint, conversationId, messages, checkConnection, pollForCompletion]
  );

  const getErrorMessage = (error: any, errorInfo: RetryableError): string => {
    if (error.name === 'AbortError') {
      return "Request timed out. Please try again.";
    }
    
    if (error instanceof Response || error.status) {
      const status = error.status || error.response?.status;
      
      if (status === 429) {
        return "Too many requests. Please wait a moment and try again.";
      }
      
      if (status >= 500) {
        return "Server error occurred. Please try again.";
      }
      
      if (status >= 400) {
        return "Request failed. Please check your input and try again.";
      }
    }
    
    if (error instanceof TypeError) {
      return "Connection failed. Please check your internet connection.";
    }
    
    return "An unexpected error occurred. Please try again.";
  };

  const sendMessage = useCallback(
    async (content: string) => {
      // If offline, queue the message
      if (!isConnected) {
        setQueuedMessages(prev => [...prev, content]);
        setConnectionStatus("reconnecting");
        
        // Try to reconnect
        const reconnected = await checkConnection();
        if (!reconnected) {
          throw new Error("Not connected to chat service. Message queued for when connection is restored.");
        }
      }

      if (!conversationId) {
        throw new Error("No conversation ID available");
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        streaming: false,
        status: "completed",
      };

      setMessages((prev) => [...prev, userMessage]);

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        streaming: true,
        status: "sending",
        chunks: {},
        retryAttempt: 0,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setHasUnread(true);

      try {
        await sendMessageWithRetry(content, assistantMessage.id);
      } catch (error) {
        console.error("Failed to send message after retries:", error);
      }
    },
    [isConnected, conversationId, sendMessageWithRetry, checkConnection]
  );

  const retryMessage = useCallback(
    async (messageId: string) => {
      const message = messages.find(m => m.id === messageId);
      if (!message || !message.originalContent) return;

      // Reset message state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: "",
                streaming: true,
                status: "sending",
                retryAttempt: 0,
                canRetry: false,
              }
            : msg
        )
      );

      try {
        await sendMessageWithRetry(message.originalContent, messageId);
      } catch (error) {
        console.error("Retry failed:", error);
      }
    },
    [messages, sendMessageWithRetry]
  );

  const cancelMessage = useCallback((messageId: string) => {
    console.group(`🚫 cancelMessage called for messageId: ${messageId}`);
    console.log('Stack trace:', new Error().stack);
    console.log('Current time:', new Date().toISOString());
    
    const abortController = abortControllersRef.current.get(messageId);
    console.log('AbortController found:', !!abortController);
    console.log('AbortController already aborted:', abortController?.signal.aborted);
    
    if (abortController) {
      console.log('Aborting controller...');
      abortController.abort();
      abortControllersRef.current.delete(messageId);
      console.log('Controller deleted from map');
    } else {
      console.warn('No AbortController found for messageId:', messageId);
    }

    // Log current message state before update
    const currentMessage = messages.find(m => m.id === messageId);
    console.log('Current message state:', {
      id: currentMessage?.id,
      status: currentMessage?.status,
      streaming: currentMessage?.streaming,
      content: currentMessage?.content?.substring(0, 50) + '...'
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              content: "Message cancelled",
              streaming: false,
              status: "cancelled",
            }
          : msg
      )
    );
    
    console.log('Message state updated to cancelled');
    console.groupEnd();
  }, [messages]);

  const markAsRead = useCallback(() => {
    setHasUnread(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setHasUnread(false);
    localStorage.removeItem("chat-widget-messages");
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setHasUnread(false);
    const newId = crypto.randomUUID();
    localStorage.setItem("chat-widget-conversation-id", newId);
    localStorage.removeItem("chat-widget-messages");
    setConversationId(newId);
  }, []);

  const contextValue: ChatWidgetContextType = {
    // Configuration
    theme: config.theme || "light",
    brandColor: config.brandColor || "#007acc",
    position: config.position || "bottom-right",
    placeholder: config.placeholder || "Type your message...",
    welcomeMessage: config.welcomeMessage || "Hi! How can I help you today?",
    apiEndpoint: config.apiEndpoint,
    allowFullscreen: config.allowFullscreen || false,

    // State
    messages,
    isConnected,
    hasUnread,
    isLoading,
    connectionStatus,
    queuedMessages,
    isFullscreen,

    // Actions
    sendMessage,
    retryMessage,
    cancelMessage,
    markAsRead,
    clearMessages,
    startNewConversation,
    toggleFullscreen,
  };

  // Persist messages to localStorage
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      localStorage.setItem("chat-widget-messages", JSON.stringify(messages));
    }
  }, [messages, isLoading]);

  return <ChatWidgetContext.Provider value={contextValue}>{children}</ChatWidgetContext.Provider>;
};

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (context === undefined) {
    throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  }
  return context;
};
