import { render, fireEvent, screen } from '@testing-library/react';
import { useHover } from './useHover';

describe('useHover', () => {
  test('returns ref and hover state', () => {
    let ref: React.RefObject<HTMLDivElement>;
    let isHover: boolean;

    const TestComponent = () => {
      [ref, isHover] = useHover<HTMLDivElement>();
      return <div ref={ref}>test</div>;
    };

    render(<TestComponent />);

    expect(ref).toHaveProperty('current');
    expect(isHover).toBe(false);
  });

  test('detects mouse enter', () => {
    let isHover: boolean;

    const TestComponent = () => {
      const [ref, hover] = useHover<HTMLDivElement>();
      isHover = hover;
      return <div ref={ref}>test</div>;
    };

    const { container } = render(<TestComponent />);
    const div = container.querySelector('div')!;

    fireEvent.mouseEnter(div);

    expect(isHover).toBe(true);
  });

  test('detects mouse leave', () => {
    let isHover: boolean;

    const TestComponent = () => {
      const [ref, hover] = useHover<HTMLDivElement>();
      isHover = hover;
      return <div ref={ref}>test</div>;
    };

    const { container } = render(<TestComponent />);
    const div = container.querySelector('div')!;

    fireEvent.mouseEnter(div);
    expect(isHover).toBe(true);

    fireEvent.mouseLeave(div);
    expect(isHover).toBe(false);
  });

  test('handles touch events', () => {
    let isHover: boolean;

    const TestComponent = () => {
      const [ref, hover] = useHover<HTMLDivElement>();
      isHover = hover;
      return <div ref={ref}>test</div>;
    };

    const { container } = render(<TestComponent />);
    const div = container.querySelector('div')!;

    fireEvent.touchStart(div);
    expect(isHover).toBe(true);

    fireEvent.touchEnd(div);
    expect(isHover).toBe(false);
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

    const TestComponent = () => {
      const [ref] = useHover<HTMLDivElement>();
      return <div ref={ref}>test</div>;
    };

    const { unmount } = render(<TestComponent />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  test('does not set hover when ref is not assigned', () => {
    let isHover: boolean;

    const TestComponent = () => {
      const [, hover] = useHover<HTMLDivElement>();
      isHover = hover;
      return <div>test</div>; // no ref
    };

    render(<TestComponent />);

    const div = screen.getByText('test');
    fireEvent.mouseEnter(div);

    expect(isHover).toBe(false);
  });
});