import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from './menubar';

describe('Menubar', () => {
  test('renders menubar with multiple menus', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('renders menubar items', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item 1</MenubarItem>
            <MenubarItem>Item 2</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders menubar with separator', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item 1</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Item 2</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders checkbox items in menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Option 1</MenubarCheckboxItem>
            <MenubarCheckboxItem>Option 2</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders radio group items in menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="option1">
              <MenubarRadioItem value="option1">Option 1</MenubarRadioItem>
              <MenubarRadioItem value="option2">Option 2</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders submenu in menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>More Options</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Sub Item</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('More Options')).toBeInTheDocument();
  });

  test('handles disabled menubar items', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>Disabled Item</MenubarItem>
            <MenubarItem>Enabled Item</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('menubar has proper accessibility structure', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Open File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    const trigger = screen.getByText('File Menu');
    expect(trigger).toBeInTheDocument();
  });
});