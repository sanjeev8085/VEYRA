import React, { useState, useEffect } from 'react';

type AnnouncementPriority = 'polite' | 'assertive';

interface AnnouncementEvent {
  message: string;
  priority: AnnouncementPriority;
  id: number;
}

// Global announcement emitter for use anywhere in the application
let announceListener: ((event: AnnouncementEvent) => void) | null = null;
let announcementCounter = 0;

/**
 * Announce a message to screen readers
 * @param message String to announce
 * @param priority 'polite' (default) or 'assertive'
 */
export const announceToScreenReader = (
  message: string,
  priority: AnnouncementPriority = 'polite'
): void => {
  if (announceListener && message) {
    announcementCounter += 1;
    announceListener({
      message,
      priority,
      id: announcementCounter,
    });
  }
};

/**
 * LiveAnnouncer component mounted at the application root.
 * Renders polite and assertive aria-live containers.
 */
export const LiveAnnouncer: React.FC = () => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  useEffect(() => {
    announceListener = (event: AnnouncementEvent) => {
      if (event.priority === 'assertive') {
        setAssertiveMessage(event.message);
        setTimeout(() => setAssertiveMessage(''), 3000);
      } else {
        setPoliteMessage(event.message);
        setTimeout(() => setPoliteMessage(''), 3000);
      }
    };

    return () => {
      announceListener = null;
    };
  }, []);

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-live-region"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-live-region"
      >
        {assertiveMessage}
      </div>
    </>
  );
};
