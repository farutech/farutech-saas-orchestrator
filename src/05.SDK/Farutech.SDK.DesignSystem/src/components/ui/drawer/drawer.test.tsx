import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

describe('Drawer', () => {
  test('renders drawer trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText('Open Drawer')).toBeInTheDocument();
  });

  test('renders drawer content when open', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
          </DrawerHeader>
          <p>Drawer content</p>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  test('renders drawer with all sections', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Trigger</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
          <div>Main content</div>
          <DrawerFooter>
            <DrawerClose>Close Button</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Close Button')).toBeInTheDocument();
  });

  test('drawer has proper accessibility attributes', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Trigger</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();
  });

  test('drawer close button works', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Trigger</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('renders drawer with custom direction', () => {
    render(
      <Drawer open direction="left">
        <DrawerTrigger>Trigger</DrawerTrigger>
        <DrawerContent>
          <p>Left drawer content</p>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText('Left drawer content')).toBeInTheDocument();
  });
});