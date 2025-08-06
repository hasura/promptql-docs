import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChatBubble } from "./ChatBubble";
import { ChatPanel } from "./ChatPanel";
import { ChatWidgetProvider } from "../context/ChatWidgetContext";
import { useDocusaurusTheme } from "../hooks/useDocusaurusTheme";
import type { ChatWidgetConfig } from "../types";

export interface ChatWidgetProps extends Omit<ChatWidgetConfig, 'theme'> {
  theme?: "light" | "dark" | "auto";
}

export const ChatWidget: React.FC<ChatWidgetProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const theme = useDocusaurusTheme(props.theme);

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement("div");
    container.id = "chat-widget-portal";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isExpanded]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isExpanded]);

  if (!portalContainer) return null;

  const config: ChatWidgetConfig = {
    ...props,
    theme,
  };

  return (
    <ChatWidgetProvider config={config}>
      {createPortal(
        <>
          {/* Backdrop for mobile */}
          {isExpanded && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                pointerEvents: "auto",
                zIndex: 999,
                opacity: window.innerWidth <= 768 ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
              onClick={() => setIsExpanded(false)}
            />
          )}

          <ChatBubble
            onClick={() => setIsExpanded(true)}
            hasUnread={false}
            style={{
              opacity: isExpanded ? 0 : 1,
              pointerEvents: isExpanded ? "none" : "auto",
              transition: "opacity 0.3s ease",
            }}
          />

          {isExpanded && (
            <ChatPanel onClose={() => setIsExpanded(false)} />
          )}
        </>,
        portalContainer
      )}
    </ChatWidgetProvider>
  );
};
