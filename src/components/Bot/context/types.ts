export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming: boolean;
  status: "sending" | "streaming" | "completed" | "failed" | "retrying";
  chunks?: {
    message?: string;
    plan?: string;
    code?: string;
  };
  canRetry?: boolean;
  originalContent?: string;
}

export interface ChatConfig {
  apiEndpoint: string;
  theme?: "light" | "dark";
  brandColor?: string;
  position?: "bottom-right" | "bottom-left";
  placeholder?: string;
  welcomeMessage?: string;
  allowFullscreen?: boolean;
}

export interface ChatWidgetContextType {
  // Core state
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  connectionStatus: "connected" | "disconnected" | "reconnecting";
  isFullscreen: boolean;
  queuedMessages: string[];
  conversationId: string;
  hasUnread: boolean;
  
  // Config values
  theme?: "light" | "dark";
  brandColor?: string;
  position?: "bottom-right" | "bottom-left";
  placeholder?: string;
  welcomeMessage?: string;
  
  // Functions
  pollForCompletion: ((messageId: string) => Promise<void>) | null;
  sendMessage: ((content: string) => Promise<void>) | null;
  toggleFullscreen: () => void;
  retryMessage: (messageId: string) => void;
  cancelMessage: (messageId: string) => void;
  clearMessages: () => void;
  startNewConversation: () => void;
  markAsRead: () => void;
}

export interface RetryableError {
  shouldRetry: boolean;
  canRetry: boolean;
  retryAfter?: number;
}

export interface StableRefs {
  config: ChatConfig;
  isConnected: boolean;
  queuedMessages: string[];
  messages: Message[];
  conversationId: string;
  pollForCompletion: ((messageId: string) => Promise<void>) | null;
  sendMessage: ((content: string) => Promise<void>) | null;
}
