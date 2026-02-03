import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    autodocs: true,
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  viteFinal: (viteConfig) => {
    const updated = {
      ...viteConfig,
      define: {
        ...(viteConfig as any).define,
        global: 'globalThis',
      },
    } as any;

    updated.build = updated.build || {};
    updated.build.chunkSizeWarningLimit = 2500;
    updated.build.rollupOptions = updated.build.rollupOptions || {};
    updated.build.rollupOptions.output = updated.build.rollupOptions.output || {};
    updated.build.rollupOptions.output.manualChunks = (id: string) => {
      if (id.includes('node_modules')) {
        const parts = id.split('node_modules/')[1].split('/');
        const pkg = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
        return `vendor_${pkg.replace('@', '').replace('/', '_')}`;
      }
    };

    return updated;
  },
};

export default config;