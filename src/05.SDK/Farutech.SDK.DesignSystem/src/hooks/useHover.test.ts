import { renderHook, act, fireEvent } from '@testing-library/react';
import { useHover } from './useHover';

describe('useHover', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test('returns ref and hover state', () => {
    const { result } = renderHook(() => useHover());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty('current');
    expect(result.current[1]).toBe(false);
  });

  test('detects mouse enter', () => {
    const { result } = renderHook(() => useHover());

    // Assign ref
    act(() => {
      result.current[0].current = element;
    });

    // Mouse enter
    act(() => {
      fireEvent.mouseEnter(element);
    });

    expect(result.current[1]).toBe(true);
  });

  test('detects mouse leave', () => {
    const { result } = renderHook(() => useHover());

    // Assign ref
    act(() => {
      result.current[0].current = element;
    });

    // Mouse enter then leave
    act(() => {
      fireEvent.mouseEnter(element);
    });
    expect(result.current[1]).toBe(true);

    act(() => {
      fireEvent.mouseLeave(element);
    });
    expect(result.current[1]).toBe(false);
  });

  test('handles touch events', () => {
    const { result } = renderHook(() => useHover());

    // Assign ref
    act(() => {
      result.current[0].current = element;
    });

    // Touch start
    act(() => {
      fireEvent.touchStart(element);
    });
    expect(result.current[1]).toBe(true);

    // Touch end
    act(() => {
      fireEvent.touchEnd(element);
    });
    expect(result.current[1]).toBe(false);
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

    const { result, unmount } = renderHook(() => useHover());

    // Assign ref
    act(() => {
      result.current[0].current = element;
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  test('does not set hover when ref is not assigned', () => {
    const { result } = renderHook(() => useHover());

    // Mouse enter without ref
    act(() => {
      fireEvent.mouseEnter(element);
    });

    expect(result.current[1]).toBe(false);
  });
});