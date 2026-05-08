import { FLOW_DIRECTIONS, FLOW_WRITING_MODES } from './constants';
import type { FlowDirection, FlowDirectionParameters, FlowWritingMode } from './types';

function resolveSupported<T extends string>(configured: readonly T[] | undefined, allowed: readonly T[]): T[] {
  if (!Array.isArray(configured) || configured.length === 0) {
    return [...allowed];
  }

  const allowedSet = new Set<string>(allowed);
  const valid = configured.filter((value): value is T => allowedSet.has(value));
  return valid.length > 0 ? valid : [...allowed];
}

function clampValue<T extends string>(value: T | undefined, supported: readonly T[], fallbackSource: readonly T[]): T {
  const fallback = supported[0] ?? fallbackSource[0];
  if (fallback === undefined) {
    throw new Error('Flow direction defaults are empty.');
  }
  return value !== undefined && supported.includes(value) ? value : fallback;
}

export function resolveSupportedWritingModes(parameters: FlowDirectionParameters | undefined): FlowWritingMode[] {
  return resolveSupported(parameters?.supportedWritingModes, FLOW_WRITING_MODES);
}

export function resolveSupportedDirections(parameters: FlowDirectionParameters | undefined): FlowDirection[] {
  return resolveSupported(parameters?.supportedDirections, FLOW_DIRECTIONS);
}

export function clampWritingMode(mode: FlowWritingMode | undefined, supported: FlowWritingMode[]): FlowWritingMode {
  return clampValue(mode, supported, FLOW_WRITING_MODES);
}

export function clampDirection(direction: FlowDirection | undefined, supported: FlowDirection[]): FlowDirection {
  return clampValue(direction, supported, FLOW_DIRECTIONS);
}
