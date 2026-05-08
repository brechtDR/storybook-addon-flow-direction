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
      // Match stylesheet source URLs generated for this repo's story CSS.
      // Matching is substring/RegExp-based against styleSheet.href or dev source attributes.
      scanScope: {
        include: [
          '/src/stories/',
          '\\src\\stories\\',
          '.stories.',
          '.module.css',
          '/stories/',
          '\\stories\\',
          '/assets/',
          '\\assets\\',
          'physical-toast',
          'PhysicalToast',
        ],
      },
    },
  },
  initialGlobals: {
    background: { value: 'light' },
  },
};

export default preview;
