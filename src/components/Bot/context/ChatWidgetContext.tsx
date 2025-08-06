import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Message, ChatConfig, ChatWidgetContextType, StableRefs } from './types';
import { useHealthCheck } from './useHealthCheck';
import { useMessaging } from './useMessaging';

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (context === undefined) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
};

interface ChatWidgetProviderProps {
  children: React.ReactNode;
  config: ChatConfig;
}

export const ChatWidgetProvider: React.FC<ChatWidgetProviderProps> = ({ children, config }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("disconnected");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  const stableRefs = useRef<StableRefs>({
    config,
    isConnected: false,
    queuedMessages: [],
    messages: [],
    conversationId: "",
    pollForCompletion: null,
    sendMessage: null
  });

  // Update refs on every render
  stableRefs.current.config = config;
  stableRefs.current.isConnected = isConnected;
  stableRefs.current.queuedMessages = queuedMessages;
  stableRefs.current.messages = messages;
  stableRefs.current.conversationId = conversationId;

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const markAsRead = useCallback(() => {
    setHasUnread(false);
  }, []);

  const startNewConversation = useCallback(() => {
    if (isLoading) return;
    
    // Generate new conversation ID
    const newConversationId = crypto.randomUUID();
    localStorage.setItem("chat-widget-conversation-id", newConversationId);
    setConversationId(newConversationId);
    
    // Clear messages
    setMessages([]);
    localStorage.removeItem("chat-widget-messages");
    
    // Reset unread status
    setHasUnread(false);
  }, [isLoading]);

  // Initialize conversation ID and load messages on mount
  useEffect(() => {
    const initializeConversation = () => {
      let storedId = localStorage.getItem("chat-widget-conversation-id");
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("chat-widget-conversation-id", storedId);
      }
      setConversationId(storedId);
      
      const storedMessages = localStorage.getItem("chat-widget-messages");
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
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

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-widget-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Health check hook
  useHealthCheck(stableRefs, setIsConnected, setConnectionStatus, setQueuedMessages);

  // Messaging hook
  const { sendMessage, pollForCompletion, cancelMessage, retryMessage } = useMessaging(
    config,
    conversationId,
    stableRefs,
    setMessages,
    setQueuedMessages,
    setConnectionStatus,
    isConnected
  );

  // Update stable refs with messaging functions
  useEffect(() => {
    stableRefs.current.pollForCompletion = pollForCompletion;
    stableRefs.current.sendMessage = sendMessage;
  }, [pollForCompletion, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("chat-widget-messages");
  }, []);

  const value: ChatWidgetContextType = {
    // Core state
    messages,
    isLoading,
    isConnected,
    connectionStatus,
    isFullscreen,
    queuedMessages,
    conversationId,
    hasUnread,
    
    // Config values passed through
    theme: config.theme,
    brandColor: config.brandColor,
    position: config.position,
    placeholder: config.placeholder,
    welcomeMessage: config.welcomeMessage,
    
    // Functions
    pollForCompletion,
    sendMessage,
    toggleFullscreen,
    retryMessage,
    cancelMessage,
    clearMessages,
    startNewConversation,
    markAsRead,
  };

  return (
    <ChatWidgetContext.Provider value={value}>
      {children}
    </ChatWidgetContext.Provider>
  );
};
