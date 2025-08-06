import type { RetryableError } from './types';

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const isRetryableError = (error: any): RetryableError => {
  if (error.name === 'AbortError') {
    return { shouldRetry: false, canRetry: true };
  }
  
  const status = error.status || error.response?.status;
  
  if (status === 429) {
    const retryAfter = error.headers?.get?.('retry-after');
    return {
      shouldRetry: true,
      canRetry: true,
      retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : 5000,
    };
  }
  
  if (status >= 500) {
    return { shouldRetry: true, canRetry: true };
  }
  
  if (status >= 400) {
    return { shouldRetry: false, canRetry: true };
  }
  
  if (error instanceof TypeError) {
    return { shouldRetry: true, canRetry: true };
  }
  
  return { shouldRetry: false, canRetry: false };
};

export const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 10000);
};

export const getErrorMessage = (error: any, errorInfo: RetryableError): string => {
  if (error.name === 'AbortError') {
    return "Request timed out. Please try again.";
  }
  
  if (error instanceof Response || error.status) {
    const status = error.status || error.response?.status;
    
    if (status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    
    if (status >= 500) {
      return "Server error occurred. Please try again.";
    }
    
    if (status >= 400) {
      return "Request failed. Please check your input and try again.";
    }
  }
  
  if (error instanceof TypeError) {
    return "Connection failed. Please check your internet connection.";
  }
  
  return "An unexpected error occurred. Please try again.";
};