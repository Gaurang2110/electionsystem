"use client";
import { useEffect } from 'react';

export const SWRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
          },
          (err) => {
          }
        );
      });
    }
  }, []);

  return null;
};
