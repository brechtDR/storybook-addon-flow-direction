export const ADDON_ID = 'storybook/flow-direction';
export const TOOL_ID = `${ADDON_ID}/tool`;
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = 'flowDirection';
export const KEY_WRITING_MODE = `${PARAM_KEY}.writingMode`;
export const KEY_DIRECTION = `${PARAM_KEY}.direction`;
export const KEY_MATRIX = `${PARAM_KEY}.matrix`;

export const FLOW_WRITING_MODES = ['horizontal-tb', 'vertical-rl', 'vertical-lr'] as const;
export const FLOW_DIRECTIONS = ['ltr', 'rtl'] as const;

export const EVENTS = {
  SCAN_RESULT: `${ADDON_ID}/scan-result`,
  SCAN_REQUEST: `${ADDON_ID}/scan-request`,
  FOCUS_FINDING: `${ADDON_ID}/focus-finding`,
} as const;
