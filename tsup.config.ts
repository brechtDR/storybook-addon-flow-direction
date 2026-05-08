import { defineConfig, type Options } from 'tsup';

const NODE_TARGET = 'node20.19'; // Minimum Node version supported by Storybook 10
const MANAGER_ENTRIES = ['src/manager.tsx', 'src/manager-helpers.tsx'];
const PREVIEW_ENTRIES = ['src/preview.ts', 'src/index.ts'];
const NODE_ENTRIES = ['src/preset.ts'];

export default defineConfig(() => {
  const commonConfig: Options = {
    /*
     keep this line commented until https://github.com/egoist/tsup/issues/1270 is resolved
     clean: options.watch ? false : true,
    */
    clean: false,
    format: ['esm'],
    treeshake: true,
    splitting: true,
    skipNodeModulesBundle: true,
    /*
     The following packages are provided by Storybook and should always be externalized
     Meaning they shouldn't be bundled with the addon, and they shouldn't be regular dependencies either
    */
    external: ['react', 'react-dom', '@storybook/icons'],
  };

  const configs: Options[] = [];

  /*
   manager entries are entries meant to be loaded into the manager UI
   they'll have manager-specific packages externalized and they won't be usable in node
   they won't have types generated for them as they're usually loaded automatically by Storybook
  */
  if (MANAGER_ENTRIES.length) {
    configs.push({
      ...commonConfig,
      entry: MANAGER_ENTRIES,
      platform: 'browser',
      target: 'esnext', // we can use esnext for manager entries since Storybook will bundle the addon's manager entries again anyway
    });
  }

  /*
   preview entries are entries meant to be loaded into the preview iframe
   they'll have preview-specific packages externalized and they won't be usable in node
   they'll have types generated for them so they can be imported by users when setting up Portable Stories or using CSF factories
  */
  if (PREVIEW_ENTRIES.length) {
    configs.push({
      ...commonConfig,
      entry: PREVIEW_ENTRIES,
      platform: 'browser',
      target: 'esnext', // we can use esnext for preview entries since the builders will bundle the addon's preview entries again anyway
      dts: true,
    });
  }

  /*
   node entries are entries meant to be used in node-only
   this is useful for presets, which are loaded by Storybook when setting up configurations
   they won't have types generated for them as they're usually loaded automatically by Storybook
  */
  if (NODE_ENTRIES.length) {
    configs.push({
      ...commonConfig,
      entry: NODE_ENTRIES,
      platform: 'node',
      target: NODE_TARGET,
    });
  }

  return configs;
});
