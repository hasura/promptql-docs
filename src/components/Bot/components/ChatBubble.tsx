import React from "react";
import { useChatWidget } from "../context/ChatWidgetContext";

interface ChatBubbleProps {
  onClick: () => void;
  hasUnread?: boolean; // Optional override
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, hasUnread: hasUnreadOverride }) => {
  const { brandColor, position, theme, hasUnread: contextHasUnread, markAsRead } = useChatWidget();

  const hasUnread = hasUnreadOverride ?? contextHasUnread;

  const handleClick = () => {
    if (hasUnread) {
      markAsRead();
    }
    onClick();
  };

  const positionStyles = {
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
  };

  const bubbleStyle: React.CSSProperties = {
    position: "fixed",
    ...positionStyles[position || "bottom-right"],
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: brandColor || "#007acc",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: theme === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 4px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "auto",
    zIndex: 1000,
  };

  const iconStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    fill: "white",
  };

  const unreadStyle: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "12px",
    height: "12px",
    backgroundColor: "#ff4444",
    borderRadius: "50%",
    border: "2px solid white",
    animation: hasUnread ? "pulse 2s infinite" : "none",
  };

  return (
    <>
      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <button
        style={bubbleStyle}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            theme === "dark" ? "0 6px 25px rgba(0, 0, 0, 0.5)" : "0 6px 25px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            theme === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 4px 20px rgba(0, 0, 0, 0.15)";
        }}
        aria-label="Open chat">
        {/* Chat icon SVG */}
        <svg style={iconStyle} viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

        {/* Unread indicator */}
        {hasUnread && <div style={unreadStyle} />}
      </button>
    </>
  );
};
