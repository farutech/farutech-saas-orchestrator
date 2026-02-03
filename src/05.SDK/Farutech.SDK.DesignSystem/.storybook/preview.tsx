import React from 'react';
import '../src/styles/globals.css';
import type { Preview } from '@storybook/react';

export const parameters: Preview['parameters'] = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { matchers: { date: /Date$/, color: /(background|color)$/i } },
};

export const decorators = [
  (Story: any) => (
    <div style={{ padding: 12 }}>
      <Story />
    </div>
  ),
];

export default { parameters };
