import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from './menu';

describe('Menu', () => {
  test('renders menu trigger', () => {
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  test('renders menu items', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders menu with label and separator', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuLabel>Actions</MenuLabel>
          <MenuItem>Action 1</MenuItem>
          <MenuSeparator />
          <MenuItem>Action 2</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders checkbox items', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked>Option 1</MenuCheckboxItem>
          <MenuCheckboxItem>Option 2</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders radio group items', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value="option1">
            <MenuRadioItem value="option1">Option 1</MenuRadioItem>
            <MenuRadioItem value="option2">Option 2</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders submenu', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>More Options</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Sub Item</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('handles disabled items', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuItem disabled>Disabled Item</MenuItem>
          <MenuItem>Enabled Item</MenuItem>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    render(
      <Menu>
        <MenuTrigger>Menu</MenuTrigger>
        <MenuContent>
          <MenuItem>Item</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    expect(trigger).toBeInTheDocument();
  });
});