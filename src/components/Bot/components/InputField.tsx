import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useChatWidget } from "../context/ChatWidgetContext";

export const InputField: React.FC = () => {
  const { theme, placeholder, sendMessage, isConnected } = useChatWidget();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Maintain focus after loading completes
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !isConnected) return;

    const message = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }

    // Reset textarea height and refocus
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus(); // Keep focus after sending
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: "40px",
    maxHeight: "120px",
    padding: "10px 12px",
    border: theme === "dark" ? "1px solid #333" : "1px solid #e1e5e9",
    borderRadius: "20px",
    backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    fontSize: "14px",
    lineHeight: "1.4",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  };

  const buttonStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: !input.trim() || isLoading || !isConnected ? (theme === "dark" ? "#333" : "#e1e5e9") : "#007acc",
    color: !input.trim() || isLoading || !isConnected ? (theme === "dark" ? "#666" : "#999") : "#ffffff",
    cursor: !input.trim() || isLoading || !isConnected ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  const connectionStatusStyle: React.CSSProperties = {
    fontSize: "12px",
    color: theme === "dark" ? "#888" : "#666",
    textAlign: "center",
    marginBottom: "8px",
  };

  return (
    <div>
      {!isConnected && <div style={connectionStatusStyle}>Connecting to chat...</div>}

      <div style={containerStyle}>
        <textarea
          ref={textareaRef}
          style={textareaStyle}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type your message..."}
          disabled={isLoading || !isConnected}
          rows={1}
        />

        <button
          style={buttonStyle}
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading || !isConnected}
          aria-label="Send message">
          {isLoading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" opacity="0.4">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      <div
        style={{
          fontSize: "11px",
          color: theme === "dark" ? "#888" : "#666",
          textAlign: "center",
          marginTop: "8px",
          lineHeight: "1.3",
        }}>
        DocsBot can make mistakes. Always verify important information by consulting the docs directly.
      </div>
    </div>
  );
};
