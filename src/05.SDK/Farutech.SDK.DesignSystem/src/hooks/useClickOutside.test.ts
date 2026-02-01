import { renderHook, act, fireEvent } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  let container: HTMLElement;
  let innerElement: HTMLElement;
  let outerElement: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    innerElement = document.createElement('button');
    outerElement = document.createElement('div');
    container.appendChild(innerElement);
    document.body.appendChild(container);
    document.body.appendChild(outerElement);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outerElement);
  });

  test('returns a ref object', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    expect(result.current).toHaveProperty('current');
    expect(result.current.current).toBeNull();
  });

  test('calls handler when clicking outside the element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    // Assign ref to inner element
    act(() => {
      if (result.current.current === null) {
        result.current.current = innerElement;
      }
    });

    // Click outside
    act(() => {
      fireEvent.mouseDown(outerElement);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does not call handler when clicking inside the element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    // Assign ref to container
    act(() => {
      if (result.current.current === null) {
        result.current.current = container;
      }
    });

    // Click inside
    act(() => {
      fireEvent.mouseDown(innerElement);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('handles touch events', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    // Assign ref
    act(() => {
      if (result.current.current === null) {
        result.current.current = innerElement;
      }
    });

    // Touch outside
    act(() => {
      fireEvent.touchStart(outerElement);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does not add listeners when disabled', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler, false));

    // Assign ref
    act(() => {
      if (result.current.current === null) {
        result.current.current = innerElement;
      }
    });

    // Click outside
    act(() => {
      fireEvent.mouseDown(outerElement);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test('cleans up event listeners on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickOutside(handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  test('updates handler when handler changes', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ handler }) => useClickOutside(handler),
      { initialProps: { handler: handler1 } }
    );

    // Assign ref
    act(() => {
      if (result.current.current === null) {
        result.current.current = innerElement;
      }
    });

    // Rerender with new handler
    rerender({ handler: handler2 });

    // Click outside
    act(() => {
      fireEvent.mouseDown(outerElement);
    });

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});