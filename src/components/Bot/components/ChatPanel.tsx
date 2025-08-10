import React, { useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { InputField } from "./InputField";
import { useChatWidget } from "../context/ChatWidgetContext";
import { TestControls } from "./TestControls";

interface ChatPanelProps {
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  const { 
    theme, 
    brandColor, 
    position, 
    startNewConversation, 
    isLoading, 
    isConnected, 
    isFullscreen, 
    toggleFullscreen,
    abortControllersRef,
    activeStreamingRequest
  } = useChatWidget();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width <= 768;
  const isTablet = windowSize.width > 768 && windowSize.width <= 1024;

  const getPositionStyles = () => {
    if (isFullscreen) {
      return {
        position: "fixed" as const,
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100vw",
        height: "100vh",
        borderRadius: "0",
        zIndex: 10000,
      };
    }

    if (isMobile) {
      return {
        bottom: "0",
        left: "0",
        right: "0",
        top: "0",
        width: "100%",
        height: "100%",
        borderRadius: "0",
      };
    }

    if (isTablet) {
      return {
        width: "90vw",
        height: "80vh",
        maxWidth: "800px",
        maxHeight: "600px",
        borderRadius: "12px",
        bottom: "20px",
        right: "20px",
      };
    }

    const baseStyles = {
      width: "1200px",
      height: "750px",
      borderRadius: "12px",
    };

    if (position === "bottom-left") {
      return { ...baseStyles, bottom: "20px", left: "20px" };
    }

    return { ...baseStyles, bottom: "20px", right: "20px" };
  };

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    ...getPositionStyles(),
    backgroundColor: 'var(--chat-container-bg)',
    boxShadow: theme === "dark" ? "0 20px 60px rgba(0, 0, 0, 0.6)" : "0 20px 60px var(--button-drop-shadow)",
    border: `1px solid var(--chat-container-border)`,
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto",
    zIndex: 1000,
    animation: isMobile
      ? "slideUpMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      : "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const headerStyle: React.CSSProperties = {
    padding: isMobile ? "12px 16px" : "16px 20px",
    borderBottom: theme === "dark" ? "1px solid #333" : "1px solid #e1e5e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    borderRadius: isMobile ? "0" : "12px 12px 0 0",
    minHeight: "56px", // Ensure touch-friendly height
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  };

  const messageAreaStyle: React.CSSProperties = {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const inputAreaStyle: React.CSSProperties = {
    padding: isMobile ? "12px 16px" : "16px 20px",
    borderTop: theme === "dark" ? "1px solid #333" : "1px solid #e1e5e9",
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    borderRadius: isMobile ? "0" : "0 0 12px 12px",
    paddingBottom: isMobile ? "calc(12px + env(safe-area-inset-bottom))" : "16px",
  };

  const newChatButtonStyle: React.CSSProperties = {
    background: "none",
    border: theme === "dark" ? "1px solid #333" : "1px solid #e1e5e9",
    color: theme === "dark" ? "#ffffff" : "#666666",
    cursor: isLoading ? "not-allowed" : "pointer",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    opacity: isLoading ? 0.5 : 1,
    transition: "all 0.2s ease",
  };

  const chatWidgetStyles = `
    [data-chat-widget] a {
      color: var(--body-link-color) !important;
      text-decoration: none;
    }
    
    [data-chat-widget] a:hover {
      color: var(--body-link-color-hover) !important;
    }
  `;

  return (
    <>
      {/* CSS keyframes and link styles injection */}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes slideUpMobile {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          ${chatWidgetStyles}
        `}
      </style>

      <div style={panelStyle} data-chat-widget>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={titleStyle}>DocsQL</h3>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isConnected ? "#22c55e" : "#ef4444",
                transition: "background-color 0.3s ease",
                flexShrink: 0,
                minWidth: "8px",
                minHeight: "8px",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              style={newChatButtonStyle}
              onClick={startNewConversation}
              title="Start new conversation">
              New Chat
            </button>
            {!isMobile && (
              <button
                style={newChatButtonStyle}
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                {isFullscreen ? '⤓' : '⤢'}
              </button>
            )}
            <button
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div style={messageAreaStyle}>
          <MessageList />
        </div>

        {/* Input Area */}
        <div style={inputAreaStyle}>
          <InputField />
        </div>
        <TestControls 
          activeStreamingRequest={activeStreamingRequest}
          abortControllersRef={abortControllersRef}
        />
      </div>
    </>
  );
};
