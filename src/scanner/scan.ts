import type { ScanScopeConfig, ScannerFinding, ScannerGroup, ScannerPayload } from '../types';
import type { DraftScannerFinding } from './parser';
import { elementHint, inlineStyleFindings, stylesheetFindings } from './dom';

interface ScanOptions {
  scanScope?: ScanScopeConfig;
}

function findingKey(element: string, finding: ScannerFinding): string {
  return `${element}::${finding.origin}::${finding.ruleSelector ?? ''}::${finding.property}::${finding.value}::${finding.suggestion}`;
}

function createFindingId(selector: string, finding: DraftScannerFinding): string {
  const raw = `${selector}--${finding.origin}--${finding.ruleSelector ?? ''}--${finding.property}--${finding.value}--${finding.suggestion}`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export function scan(root: ParentNode, options: ScanOptions = {}): ScannerPayload {
  const wrappers = Array.from(root.querySelectorAll('[data-flow-direction-wrapper]'));
  const isMatrix = root.querySelector('[data-flow-direction-matrix]') !== null;
  const containers: Element[] =
    isMatrix && wrappers.length > 0 ? [wrappers[0] as Element] : wrappers.length > 0 ? wrappers : [root as Element];

  const groupedByElement = new Map<string, ScannerFinding[]>();
  const dedupKeys = new Set<string>();

  containers.forEach((container) => {
    const findings = [...stylesheetFindings(container, options.scanScope), ...inlineStyleFindings(container)];

    for (const { target, finding } of findings) {
      const selector = elementHint(target);
      const hydratedFinding: ScannerFinding = {
        findingId: createFindingId(selector, finding),
        selector,
        property: finding.property,
        value: finding.value,
        suggestion: finding.suggestion,
        origin: finding.origin,
        ruleSelector: finding.ruleSelector,
      };

      const dedupKey = findingKey(selector, hydratedFinding);
      if (dedupKeys.has(dedupKey)) {
        continue;
      }
      dedupKeys.add(dedupKey);

      const existing = groupedByElement.get(selector) ?? [];
      existing.push(hydratedFinding);
      groupedByElement.set(selector, existing);
    }
  });

  const groups: ScannerGroup[] = Array.from(groupedByElement.entries()).map(([element, findings]) => ({
    element,
    findings,
  }));

  return {
    groups,
    scannedElements: containers.reduce((total, container) => total + container.querySelectorAll('*').length, 0),
    totalFindings: groups.reduce((total, group) => total + group.findings.length, 0),
  };
}
