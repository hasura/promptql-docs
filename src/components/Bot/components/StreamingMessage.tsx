import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useChatWidget } from '../context/ChatWidgetContext';
import type { Message } from '../types';

interface StreamingMessageProps {
  message: Message;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ message }) => {
  const { theme, brandColor } = useChatWidget();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showThinking, setShowThinking] = useState(false);

  // Track when content updates
  useEffect(() => {
    setLastUpdate(Date.now());
  }, [message.content, message.chunks?.message]);

  // Log when streaming starts/ends
  useEffect(() => {
    if (message.streaming) {
      console.log(`🚀 Message stream started for ID: ${message.id}`);
    } else {
      console.log(`✅ Message stream ended for ID: ${message.id}`);
    }
  }, [message.streaming, message.id]);

  // Show thinking indicator if no updates for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (message.streaming) {
        setShowThinking(true);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      setShowThinking(false);
    };
  }, [lastUpdate, message.streaming, message.id]);

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
    boxShadow: showThinking && message.streaming 
      ? `0 0 20px ${brandColor || '#007acc'}40` 
      : 'none',
    animation: showThinking && message.streaming 
      ? 'thinkingPulse 2s infinite ease-in-out' 
      : 'none',
    transition: 'box-shadow 0.3s ease',
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

  const thinkingTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme === 'dark' ? '#888' : '#666',
    marginTop: '4px',
    marginLeft: '16px',
    fontStyle: 'italic',
    opacity: 0.8,
  };

  const hasContent = message.content || (message.chunks?.message);
  const displayContent = message.content || message.chunks?.message || '';

  return (
    <>
      <style>
        {`
          @keyframes thinkingPulse {
            0%, 100% { 
              box-shadow: 0 0 10px ${brandColor || '#007acc'}20;
            }
            50% { 
              box-shadow: 0 0 30px ${brandColor || '#007acc'}60;
            }
          }
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
          .typing-dot-1 { animation-delay: 0s; }
          .typing-dot-2 { animation-delay: 0.2s; }
          .typing-dot-3 { animation-delay: 0.4s; }
          @keyframes thinkingDots {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
          }
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
        {hasContent && message.streaming && (
          <div style={{
            ...thinkingTextStyle,
            opacity: showThinking ? 0.8 : 0,
            transition: 'opacity 0.3s ease'
          }}>
            🧠 DocsQL is thinking
            <span style={{ display: 'inline-block' }}>
              <span style={{ animation: 'thinkingDots 1.5s infinite' }}>.</span>
              <span style={{ animation: 'thinkingDots 1.5s infinite 0.5s' }}>.</span>
              <span style={{ animation: 'thinkingDots 1.5s infinite 1s' }}>.</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
};
