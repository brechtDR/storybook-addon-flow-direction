import { fileURLToPath } from 'node:url';

/**
 * Dev server: addon preview + manager load from ../src/* so toolbar + decorator track source without a prior build.
 * Release tarball + external consumers keep using Storybook preset entries that point at dist/.
 */
export function previewAnnotations(entry = []) {
  return [...entry, fileURLToPath(import.meta.resolve('../src/preview.ts'))];
}

export function managerEntries(entry = []) {
  return [...entry, fileURLToPath(import.meta.resolve('../src/manager.tsx'))];
}

export const viteFinal = async (config: unknown) => config;

export const webpack = async (config: unknown) => config;
