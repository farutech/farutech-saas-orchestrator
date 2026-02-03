import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

describe('Toast', () => {
  test('renders toast with basic content', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a toast message</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a toast message')).toBeInTheDocument();
  });

  test('renders toast with action', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Action Required</ToastTitle>
          <ToastDescription>Please confirm your action</ToastDescription>
          <ToastAction altText="Confirm">Confirm</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Action Required')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('renders toast with close button', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Closable Toast</ToastTitle>
          <ToastDescription>You can close this</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Closable Toast')).toBeInTheDocument();
    expect(screen.getByText('You can close this')).toBeInTheDocument();
  });

  test('renders toast with different variants', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>Something went wrong</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('renders toast viewport', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const viewport = document.querySelector('[data-radix-toast-viewport]');
    expect(viewport).toBeInTheDocument();
  });

  test('toast has proper accessibility', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Accessible Toast</ToastTitle>
          <ToastDescription>With proper ARIA attributes</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = document.querySelector('[role="status"]');
    expect(toast).toBeInTheDocument();
  });

  test('renders toast with custom className', () => {
    const { container } = render(
      <ToastProvider>
        <Toast className="custom-toast">
          <ToastTitle>Custom Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = document.querySelector('.custom-toast');
    expect(toast).toBeInTheDocument();
    expect(screen.getAllByText('Custom Toast')[0]).toBeInTheDocument();
  });

  test('renders toast with swipe direction', () => {
    render(
      <ToastProvider>
        <Toast swipeDirection="right">
          <ToastTitle>Swipeable Toast</ToastTitle>
          <ToastDescription>Swipe to dismiss</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Swipeable Toast')).toBeInTheDocument();
    expect(screen.getByText('Swipe to dismiss')).toBeInTheDocument();
  });

  test('renders complex toast content', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Complex Notification</ToastTitle>
          <ToastDescription>
            This toast contains multiple lines of text and provides detailed information
            about the event that occurred.
          </ToastDescription>
          <div className="mt-2">
            <button className="mr-2">Accept</button>
            <button>Decline</button>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Complex Notification')).toBeInTheDocument();
    expect(screen.getByText(/This toast contains multiple lines/)).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  test('renders toast provider with multiple toasts', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>First Toast</ToastTitle>
        </Toast>
        <Toast>
          <ToastTitle>Second Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('First Toast')).toBeInTheDocument();
    expect(screen.getByText('Second Toast')).toBeInTheDocument();
  });
});