import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useChatWidget } from '../context/ChatWidgetContext';
import type { Message } from '../types';

interface StreamingMessageProps {
  message: Message;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ message }) => {
  const { theme } = useChatWidget();

  const messageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '85%',
    alignSelf: 'flex-start',
  };

  const bubbleStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '16px 16px 16px 4px',
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f3f4',
    color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    wordBreak: 'break-word',
    fontSize: '14px',
    lineHeight: '1.4',
    position: 'relative',
  };

  const typingIndicatorStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '8px',
    opacity: 0.6,
  };

  const dotStyle: React.CSSProperties = {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    animation: 'typing 1.4s infinite ease-in-out',
  };

  // Show current content or typing indicator
  const hasContent = message.content || (message.chunks?.message);
  const displayContent = message.content || message.chunks?.message || '';

  return (
    <>
      {/* CSS for typing animation */}
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
          .typing-dot-1 { animation-delay: 0s; }
          .typing-dot-2 { animation-delay: 0.2s; }
          .typing-dot-3 { animation-delay: 0.4s; }
        `}
      </style>

      <div style={messageStyle}>
        <div style={bubbleStyle}>
          {hasContent ? (
            <MarkdownRenderer content={displayContent} />
          ) : (
            <div style={typingIndicatorStyle}>
              Thinking
              <div style={dotStyle} className="typing-dot-1" />
              <div style={dotStyle} className="typing-dot-2" />
              <div style={dotStyle} className="typing-dot-3" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};