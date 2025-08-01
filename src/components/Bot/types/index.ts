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
}
