import { useEffect, useRef } from 'react';
import type { StableRefs } from './types';

export const useHealthCheck = (
  stableRefs: React.MutableRefObject<StableRefs>,
  setIsConnected: (connected: boolean) => void,
  setConnectionStatus: (status: "connected" | "disconnected" | "reconnecting") => void,
  setQueuedMessages: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    let consecutiveFailures = 0;
    const maxFailures = 3;
    
    const runHealthCheck = async () => {
      if (!mounted) return;
      
      try {
        const currentConfig = stableRefs.current.config;
        const response = await fetch(`${currentConfig.apiEndpoint}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
        });
        
        const wasConnected = stableRefs.current.isConnected;
        const nowConnected = response.ok;
        
        setIsConnected(nowConnected);
        setConnectionStatus(nowConnected ? "connected" : "disconnected");
        stableRefs.current.isConnected = nowConnected;
        
        if (nowConnected) {
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
          if (consecutiveFailures >= maxFailures) {
            console.error(`🚨 ${consecutiveFailures} consecutive health check failures`);
          }
        }
        
        if (!wasConnected && nowConnected) {
          const currentMessages = stableRefs.current.messages;
          const incompleteMessages = currentMessages.filter(msg => 
            msg.streaming || msg.status === 'sending' || msg.status === 'retrying'
          );
          
          incompleteMessages.forEach(msg => {
            if (stableRefs.current.pollForCompletion) {
              stableRefs.current.pollForCompletion(msg.id);
            }
          });
          
          const currentQueue = stableRefs.current.queuedMessages;
          if (currentQueue.length > 0) {
            setQueuedMessages([]);
            
            setTimeout(() => {
              currentQueue.forEach(message => {
                if (stableRefs.current.sendMessage) {
                  stableRefs.current.sendMessage(message).catch(console.error);
                }
              });
            }, 0);
          }
        }
      } catch (error) {
        console.error('🚨 Health check error:', error);
        setIsConnected(false);
        setConnectionStatus("disconnected");
        stableRefs.current.isConnected = false;
        consecutiveFailures++;
      }
    };
    
    runHealthCheck();
    const intervalId = setInterval(runHealthCheck, 30000);
    healthCheckIntervalRef.current = intervalId;
    
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
      healthCheckIntervalRef.current = null;
    };
  }, [stableRefs, setIsConnected, setConnectionStatus, setQueuedMessages]);

  return healthCheckIntervalRef;
};