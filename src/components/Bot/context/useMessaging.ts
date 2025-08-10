import { useCallback, useRef } from 'react';
import type { Message, ChatConfig, StableRefs } from './types';
import { sleep, isRetryableError, getRetryDelay, getErrorMessage } from './utils';
import * as Sentry from '@sentry/react';


export const useMessaging = (
  config: ChatConfig,
  conversationId: string,
  stableRefs: React.MutableRefObject<StableRefs>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setQueuedMessages: React.Dispatch<React.SetStateAction<string[]>>,
  setConnectionStatus: (status: "connected" | "disconnected" | "reconnecting") => void,
  isConnected: boolean
) => {
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const activeStreamingRequest = useRef<string | null>(null);

  const checkForBackgroundCompletion = useCallback(async (messageId: string) => {
    console.log(`🔍 Checking background completion for messageId: ${messageId}`);
    try {
      const currentConversationId = stableRefs.current.conversationId;
      const url = `${stableRefs.current.config.apiEndpoint}/chat/conversations/${currentConversationId}/state`;
      console.log(`📡 Polling URL: ${url}`);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if the response indicates completion
        if (data.isComplete && data.messageContent) {
          console.log(`✅ Background completion found for messageId: ${messageId}`);
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: data.messageContent, 
                  status: 'completed', 
                  streaming: false,
                  chunks: data.chunks || {},
                  isPolling: false
                }
              : msg
          ));
          return true;
        }
        
        // If isComplete is true but no messageContent, there might be a server issue
        if (data.isComplete && !data.messageContent) {
          console.warn(`⚠️ Server says complete but no content for messageId: ${messageId}`);
        }
      }
    } catch (error) {
      console.error("Background completion check failed:", error);
      Sentry.captureException(error);
    }
    return false;
  }, [setMessages, stableRefs]);

  const pollForCompletion = useCallback(async (messageId: string) => {
    const maxPolls = 10;
    let polls = 0;
    
    while (polls < maxPolls) {
      try {
        const currentConversationId = stableRefs.current.conversationId;
        const response = await fetch(`${stableRefs.current.config.apiEndpoint}/chat/conversations/${currentConversationId}/state`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (response.ok) {
          const data = await response.json();
          const targetMessage = data.messages?.find((msg: any) => msg.id === messageId);
          if (targetMessage && targetMessage.status === 'completed') {
            setMessages(prev => prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: targetMessage.content, status: 'completed', streaming: false }
                : msg
            ));
            return;
          }
        }
      } catch (error) {
        console.error("Polling failed:", error);
        Sentry.captureException(error);
      }
      
      polls++;
      await sleep(3000);
    }
  }, [setMessages, stableRefs]);

  const sendMessageWithRetry = useCallback(
    async (content: string, messageId: string, maxRetries = 3): Promise<void> => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const abortController = abortControllersRef.current.get(messageId);
        if (!abortController || abortController.signal.aborted) {
          return;
        }

        try {
          const currentMessages = await new Promise<Message[]>(resolve => {
            setMessages(prev => {
              resolve(prev);
              return prev;
            });
          });
          
          const history = currentMessages
            .filter((msg) => !msg.streaming && msg.status !== "failed")
            .map((msg) => ({ role: msg.role, content: msg.content }));

          const response = await fetch(`${config.apiEndpoint}/chat/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Connection": "keep-alive"
            },
            body: JSON.stringify({ message: content, history }),
            signal: abortController.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body reader available");
          }

          const decoder = new TextDecoder();
          let buffer = "";
          let hasReceivedContent = false;

          try {
            let streamComplete = false;
            
            while (true && !streamComplete) {
              if (abortController.signal.aborted) {
                reader.cancel();
                return;
              }

              const { done, value } = await reader.read();
              
              if (done && !hasReceivedContent) {
                console.error(`❌ Stream ended without content for messageId: ${messageId} - connection dropped`);
                throw new Error("Connection dropped during streaming");
              }
              
              if (done && !streamComplete) {
                console.warn(`⚠️ Stream ended unexpectedly for messageId: ${messageId} - no completion signal received`);
                // Stream ended without completion signal - likely disconnected
                throw new Error("Stream disconnected without completion signal");
              }
              
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    // Handle completion signal
                    if (data.done) {
                      console.log(`✅ Received completion signal for messageId: ${messageId}`);
                      hasReceivedContent = true;
                      streamComplete = true; // Flag to exit main loop cleanly
                      break; // Exit the parsing loop
                    }
                    
                    if (data.success && data.message) {
                      hasReceivedContent = true;
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === messageId
                            ? {
                                ...msg,
                                content: data.message,
                                status: "streaming",
                                chunks: {
                                  ...msg.chunks,
                                  message: data.message,
                                  plan: data.plan,
                                  code: data.code,
                                },
                              }
                            : msg
                        )
                      );
                    }
                  } catch (e) {
                    console.error(`❌ Failed to parse SSE data for messageId: ${messageId}:`, e);
                  }
                }
              }

              await new Promise(resolve => setTimeout(resolve, 0));
            }
          } catch (streamError) {
            console.error(`❌ Stream error for messageId: ${messageId}:`, streamError);
            console.error(`❌ Stream error details:`, {
              name: streamError.name,
              message: streamError.message,
              stack: streamError.stack,
              aborted: abortController.signal.aborted
            });
            Sentry.captureException(streamError, {
              tags: {
                operation: 'stream_disconnect',
                errorType: streamError.name,
                hasReceivedContent: hasReceivedContent.toString()
              }
            });
            
            // For testing: treat manual aborts as network disconnects in development
            const isTestingDisconnect = process.env.NODE_ENV === 'development' && 
                                        streamError.name === 'AbortError' && 
                                        streamError.message.includes('BodyStreamBuffer was aborted');
            
            if (abortController.signal.aborted && !isTestingDisconnect) {
              console.log(`🔄 Stream aborted for messageId: ${messageId}`);
              return;
            }
            
            console.warn(`🔄 Stream disconnected for messageId: ${messageId}, starting background polling immediately`);
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { 
                      ...msg, 
                      content: hasReceivedContent ? msg.content : "Connection lost, checking for completion...", 
                      status: "streaming",
                      streaming: true,
                      isPolling: true
                    }
                  : msg
              )
            );
            
            // Start polling immediately and more frequently
            const pollInterval = setInterval(async () => {
              const completed = await checkForBackgroundCompletion(messageId);
              if (completed) {
                clearInterval(pollInterval);
              }
            }, 2000); // Poll every 2 seconds instead of 5
            
            setTimeout(() => clearInterval(pollInterval), 120000); // 2 minutes max
            return;
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, streaming: false, status: "completed" }
                : msg
            )
          );
          
          abortControllersRef.current.delete(messageId);
          return;
          
        } catch (error) {
          console.error(`❌ Request failed for messageId: ${messageId}, attempt ${attempt + 1}:`, error);
          
          if (error.name === 'AbortError') {
            abortControllersRef.current.delete(messageId);
            return;
          }
          
          const errorInfo = isRetryableError(error);
          
          if (attempt === maxRetries - 1 || !errorInfo.shouldRetry) {
            Sentry.captureException(error, {
              tags: { messageId, operation: 'send_message', finalAttempt: true },
              extra: { attempt, maxRetries, errorInfo }
            });
            abortControllersRef.current.delete(messageId);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      content: getErrorMessage(error, errorInfo),
                      streaming: false,
                      status: "failed",
                      canRetry: errorInfo.canRetry,
                      originalContent: content,
                    }
                  : msg
              )
            );
            throw error;
          }
          
          const delay = getRetryDelay(attempt);
          await sleep(errorInfo.retryAfter || delay);
        }
      }
    },
    [config.apiEndpoint, conversationId, checkForBackgroundCompletion, setMessages]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (activeStreamingRequest.current) {
        console.warn("🚫 Blocking new request - already streaming:", activeStreamingRequest.current);
        return;
      }

      if (!isConnected) {
        setQueuedMessages(prev => [...prev, content]);
        setConnectionStatus("reconnecting");
        return;
      }

      if (!conversationId) {
        const error = new Error("No conversation ID available");
        Sentry.captureException(error, {
          tags: { operation: 'send_message_validation' }
        });
        throw error;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        streaming: false,
        status: "completed",
      };

      setMessages((prev) => [...prev, userMessage]);

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        streaming: true,
        status: "sending",
        chunks: {},
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const abortController = new AbortController();
      abortControllersRef.current.set(assistantMessageId, abortController);
      activeStreamingRequest.current = assistantMessageId;

      try {
        await sendMessageWithRetry(content, assistantMessageId);
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        activeStreamingRequest.current = null;
        abortControllersRef.current.delete(assistantMessageId);
      }
    },
    [isConnected, conversationId, setMessages, setQueuedMessages, setConnectionStatus, sendMessageWithRetry]
  );

  const cancelMessage = useCallback((messageId: string) => {
    const controller = abortControllersRef.current.get(messageId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(messageId);
      
      if (activeStreamingRequest.current === messageId) {
        activeStreamingRequest.current = null;
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  }, [setMessages]);

  const retryMessage = useCallback((messageId: string) => {
    setMessages(prev => {
      const message = prev.find(msg => msg.id === messageId);
      if (message?.originalContent) {
        sendMessage(message.originalContent);
        return prev.filter(msg => msg.id !== messageId);
      }
      return prev;
    });
  }, [setMessages, sendMessage]);

  return {
    sendMessage,
    pollForCompletion,
    cancelMessage,
    retryMessage,
    abortControllersRef,
    activeStreamingRequest
  };
};
