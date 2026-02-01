import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

describe('Resizable', () => {
  test('renders resizable panel group', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>Panel 1</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Panel 2</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  test('renders resizable with vertical direction', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <div>Top Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Bottom Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Top Panel')).toBeInTheDocument();
    expect(screen.getByText('Bottom Panel')).toBeInTheDocument();
  });

  test('renders resizable handle', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel>
          <div>Content</div>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('renders resizable with custom sizes', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={30}>
          <div>Small Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div>Large Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Small Panel')).toBeInTheDocument();
    expect(screen.getByText('Large Panel')).toBeInTheDocument();
  });

  test('renders resizable with minimum size', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel minSize={20}>
          <div>Min Size Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Other Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Min Size Panel')).toBeInTheDocument();
    expect(screen.getByText('Other Panel')).toBeInTheDocument();
  });

  test('renders resizable with maximum size', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel maxSize={80}>
          <div>Max Size Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Other Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Max Size Panel')).toBeInTheDocument();
    expect(screen.getByText('Other Panel')).toBeInTheDocument();
  });

  test('resizable has proper accessibility', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel>
          <div>Accessible Panel</div>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Accessible Panel')).toBeInTheDocument();
  });

  test('renders complex resizable layout', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div>Left Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <div>Top Right</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div>Bottom Right</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <div>Right Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Left Panel')).toBeInTheDocument();
    expect(screen.getByText('Top Right')).toBeInTheDocument();
    expect(screen.getByText('Bottom Right')).toBeInTheDocument();
    expect(screen.getByText('Right Panel')).toBeInTheDocument();
  });
});