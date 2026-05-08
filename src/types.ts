import type { FLOW_DIRECTIONS, FLOW_WRITING_MODES } from './constants';

export type FlowWritingMode = (typeof FLOW_WRITING_MODES)[number];
export type FlowDirection = (typeof FLOW_DIRECTIONS)[number];

export interface FlowDirectionSettings {
  writingMode: FlowWritingMode;
  direction: FlowDirection;
  matrix: boolean;
}

export type ScanScopeMatch = string | RegExp;

export interface ScanScopeConfig {
  include?: ScanScopeMatch[];
  exclude?: ScanScopeMatch[];
}

export interface FlowDirectionParameters {
  matrix?: boolean;
  supportedWritingModes?: FlowWritingMode[];
  supportedDirections?: FlowDirection[];
  scanScope?: ScanScopeConfig;
}

export interface ScannerFinding {
  findingId: string;
  selector: string;
  property: string;
  value: string;
  suggestion: string;
  origin: 'stylesheet' | 'inline';
  ruleSelector?: string;
}

export interface ScannerGroup {
  element: string;
  findings: ScannerFinding[];
}

export interface ScannerPayload {
  groups: ScannerGroup[];
  scannedElements: number;
  totalFindings: number;
}
