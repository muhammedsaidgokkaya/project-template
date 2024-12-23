import { useRef, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useMessagesScroll(messages) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messagesEndRef };
}
