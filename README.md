# Storybook Addon Flow Direction

Validate components across writing modes and text directions directly in Storybook.
Detect physical CSS usage and get logical-property suggestions before shipping.

## Install

```bash
pnpm add -D storybook-addon-flow-direction
```

```bash
npm install -D storybook-addon-flow-direction
```

```bash
yarn add -D storybook-addon-flow-direction
```

## Register the addon

Add it to `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  addons: ['storybook-addon-flow-direction'],
};

export default config;
```

## Toolbar

The **Flow Direction** toolbar includes:

- writing mode (`horizontal-tb`, `vertical-rl`, `vertical-lr`)
- direction (`ltr`, `rtl`)
- matrix mode toggle
- reset action

Use the toolbar to switch context, then run a scan from the panel.

![Storybook canvas in matrix mode across writing-mode and direction combinations](assets/screenshots/matrix-view.png)

## Scanner

The scanner checks rendered DOM and authored styles for physical CSS that can break in RTL or vertical layouts.

It reports matches from:

- stylesheet declarations that are readable via CSSOM
- inline `style` attributes

Examples:

- `padding-left` -> `padding-inline-start`
- `margin-right` -> `margin-inline-end`
- `left` -> `inset-inline-start`
- `text-align: left` -> `text-align: start`
- `scroll-snap-type: x mandatory` -> `scroll-snap-type: inline mandatory`

Cross-origin stylesheets that block `cssRules` access are skipped.

## Panel workflow

![Flow Direction panel with grouped findings and focus actions](assets/screenshots/scanner-panel.png)

1. Open a story.
2. Click **Re-scan** in the Flow Direction panel.
3. Review grouped findings.
4. Click **Focus offender** to jump to the element in preview.

Selector hints used by **Focus offender** are derived in this order: `data-testid`, `data-flow-direction-label`, `id`, then the first class token.
Class tokens keep semantic hyphenated names intact (for example `physical-toast`), while CSS-module style underscore hash suffixes are normalized for readability.

## Configuration

Supported parameters:

- `flowDirection.matrix` (`boolean`, story-level) - render the story in a six-cell matrix
- `flowDirection.supportedWritingModes` (`FlowWritingMode[]`, project-level) - writing modes shown in toolbar and matrix
- `flowDirection.supportedDirections` (`FlowDirection[]`, project-level) - directions shown in toolbar and matrix
- `flowDirection.scanScope` (`{ include?: (string | RegExp)[]; exclude?: (string | RegExp)[] }`) - restrict scanner to matching stylesheet sources

Set project-wide defaults in `.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    flowDirection: {
      supportedWritingModes: ['horizontal-tb', 'vertical-rl', 'vertical-lr'],
      supportedDirections: ['ltr', 'rtl'],
      // Optional:
      // scanScope: { include: [/my-app/], exclude: ['vendor.css'] },
      scanScope: {
        // Match local story stylesheets in root-level `stories/` setups.
        // Include build-time asset URLs so hashed CSS chunks are scanned too.
        include: ['/src/stories/', '\\src\\stories\\', '.stories.', '.module.css', '/stories/', '\\stories\\', '/assets/', '\\assets\\'],
      },
    },
  },
};

export default preview;
```

If your story CSS still does not appear in scan results, add project-specific identifiers from generated stylesheet sources (for example chunk names) and keep the include list focused so you do not scan unrelated Storybook UI/vendor styles.

## Compatibility

- Storybook `10.x`
- Node.js `>=20.19`

## License

MIT
