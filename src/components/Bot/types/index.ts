export interface StreamingChunk {
  success: boolean;
  conversationId?: string;
  step?: "plan" | "code" | "message";
  plan?: string;
  code?: string;
  message?: string;
  timestamp?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming: boolean;
  status?: "sending" | "retrying" | "streaming" | "completed" | "failed" | "cancelled";
  retryAttempt?: number;
  canRetry?: boolean;
  originalContent?: string;
  chunks?: {
    plan?: string;
    code?: string;
    message?: string;
  };
}

export interface ChatWidgetConfig {
  apiEndpoint: string;
  theme?: "light" | "dark";
  brandColor?: string;
  position?: "bottom-right" | "bottom-left";
  placeholder?: string;
  welcomeMessage?: string;
  allowFullscreen?: boolean;
}
