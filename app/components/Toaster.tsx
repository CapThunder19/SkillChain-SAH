'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid rgba(128, 128, 128, 0.2)',
        },
        className: 'dark:bg-gray-800 dark:border-gray-700',
      }}
    />
  );
}
