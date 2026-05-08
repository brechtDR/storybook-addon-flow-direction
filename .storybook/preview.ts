import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    flowDirection: {
      // Subset example (uncomment to shrink the toolbar + matrix):
      // supportedWritingModes: ['horizontal-tb'],
      // supportedDirections: ['ltr', 'rtl'],
    },
  },
  initialGlobals: {
    background: { value: 'light' },
  },
};

export default preview;
