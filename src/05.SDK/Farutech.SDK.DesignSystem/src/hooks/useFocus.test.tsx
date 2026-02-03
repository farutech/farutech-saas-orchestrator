import { render, fireEvent, screen } from '@testing-library/react';
import { useFocus } from './useFocus';

describe('useFocus', () => {
  test('returns focus state and methods', () => {
    let focusState: ReturnType<typeof useFocus>;

    const TestComponent = () => {
      focusState = useFocus();
      return <input ref={focusState.ref} />;
    };

    render(<TestComponent />);

    expect(focusState.ref).toHaveProperty('current');
    expect(focusState.isFocused).toBe(false);
    expect(typeof focusState.focus).toBe('function');
    expect(typeof focusState.blur).toBe('function');
  });

  test('detects focus and blur', () => {
    let isFocused: boolean;

    const TestComponent = () => {
      const { ref, isFocused: focused } = useFocus();
      isFocused = focused;
      return <input ref={ref} />;
    };

    const { container } = render(<TestComponent />);
    const input = container.querySelector('input')!;

    fireEvent.focus(input);
    expect(isFocused).toBe(true);

    fireEvent.blur(input);
    expect(isFocused).toBe(false);
  });

  test('focus method focuses the element', () => {
    let focusState: ReturnType<typeof useFocus>;

    const TestComponent = () => {
      focusState = useFocus();
      return <input ref={focusState.ref} />;
    };

    const { container } = render(<TestComponent />);
    const input = container.querySelector('input')!;

    // Mock focus
    const focusSpy = vi.fn();
    input.focus = focusSpy;

    focusState.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  test('blur method blurs the element', () => {
    let focusState: ReturnType<typeof useFocus>;

    const TestComponent = () => {
      focusState = useFocus();
      return <input ref={focusState.ref} />;
    };

    const { container } = render(<TestComponent />);
    const input = container.querySelector('input')!;

    // Mock blur
    const blurSpy = vi.fn();
    input.blur = blurSpy;

    focusState.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  test('autoFocus option focuses on mount', async () => {
    const TestComponent = () => {
      const { ref } = useFocus({ autoFocus: true });
      return <input ref={ref} />;
    };

    const { container } = render(<TestComponent />);
    const input = container.querySelector('input')!;

    // Mock focus
    const focusSpy = vi.fn();
    input.focus = focusSpy;

    // Wait for autoFocus
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(focusSpy).toHaveBeenCalled();
  });

  test('trap option prevents tab navigation', () => {
    let focusState: ReturnType<typeof useFocus>;

    const TestComponent = () => {
      focusState = useFocus({ trap: true });
      return <input ref={focusState.ref} />;
    };

    const { container } = render(<TestComponent />);
    const input = container.querySelector('input')!;

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Tab' });

    // Focus should remain on the input
    expect(document.activeElement).toBe(input);
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

    const TestComponent = () => {
      const { ref } = useFocus();
      return <input ref={ref} />;
    };

    const { unmount } = render(<TestComponent />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});