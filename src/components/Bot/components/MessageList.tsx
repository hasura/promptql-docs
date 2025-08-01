import React, { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import { StreamingMessage } from "./StreamingMessage";
import { useChatWidget } from "../context/ChatWidgetContext";

export const MessageList: React.FC = () => {
  const { messages, welcomeMessage, theme } = useChatWidget();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const containerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    minWidth: 0, // Critical: allows flex items to shrink
    overflowX: "hidden",
  };

  const welcomeStyle: React.CSSProperties = {
    padding: "16px",
    backgroundColor: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
    borderRadius: "8px",
    border: theme === "dark" ? "1px solid #333" : "1px solid #e1e5e9",
    color: theme === "dark" ? "#ccc" : "#666",
    fontSize: "14px",
    fontStyle: "italic",
    textAlign: "center",
  };

  const emptyStateStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme === "dark" ? "#666" : "#999",
    fontSize: "14px",
    textAlign: "center",
  };

  return (
    <div ref={scrollRef} style={containerStyle}>
      {/* Welcome message */}
      {welcomeMessage && messages.length === 0 && <div style={welcomeStyle}>{welcomeMessage}</div>}

      {/* Empty state */}
      {!welcomeMessage && messages.length === 0 && (
        <div style={emptyStateStyle}>Start a conversation by typing a message below</div>
      )}

      {/* Messages */}
      {messages.map((message) =>
        message.streaming ? (
          <StreamingMessage key={message.id} message={message} />
        ) : (
          <MessageItem key={message.id} message={message} />
        )
      )}
    </div>
  );
};
