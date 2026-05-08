import { getLogicalSuggestion } from './suggestions';

export interface DraftScannerFinding {
  property: string;
  value: string;
  suggestion: string;
  origin: 'stylesheet' | 'inline';
  ruleSelector?: string;
}

interface RawDeclaration {
  property: string;
  value: string;
}

function hasEffectiveValue(property: string, value: string): boolean {
  const normalizedProperty = property.trim().toLowerCase();
  const normalizedValue = value.trim().toLowerCase();

  if (
    normalizedValue === 'auto' &&
    (normalizedProperty === 'overflow-x' ||
      normalizedProperty === 'overflow-y' ||
      normalizedProperty === 'overscroll-behavior-x' ||
      normalizedProperty === 'overscroll-behavior-y')
  ) {
    return true;
  }

  return (
    normalizedValue !== '' &&
    normalizedValue !== '0' &&
    normalizedValue !== '0px' &&
    normalizedValue !== 'none' &&
    normalizedValue !== 'auto' &&
    normalizedValue !== 'initial' &&
    normalizedValue !== 'inherit' &&
    normalizedValue !== 'unset' &&
    normalizedValue !== 'revert'
  );
}

function parseDeclarations(cssText: string): RawDeclaration[] {
  return cssText
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const separatorIndex = chunk.indexOf(':');
      if (separatorIndex === -1) {
        return null;
      }

      const property = chunk.slice(0, separatorIndex).trim().toLowerCase();
      const value = chunk.slice(separatorIndex + 1).trim();
      if (!property || !value) {
        return null;
      }

      return { property, value };
    })
    .filter((entry): entry is RawDeclaration => entry !== null);
}

export function collectPhysicalDeclarations(
  cssText: string,
  origin: DraftScannerFinding['origin'],
  ruleSelector?: string,
): DraftScannerFinding[] {
  const findings: DraftScannerFinding[] = [];

  for (const { property, value } of parseDeclarations(cssText)) {
    if (!hasEffectiveValue(property, value)) {
      continue;
    }

    const suggestion = getLogicalSuggestion(property, value);
    if (!suggestion) {
      continue;
    }

    findings.push({ property, value, suggestion, origin, ruleSelector });
  }

  return findings;
}
