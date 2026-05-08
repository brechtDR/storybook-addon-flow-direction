import type { ScanScopeConfig, ScanScopeMatch } from '../types';
import { POSITION_DEPENDENT_PROPERTIES, STATEFUL_PSEUDO_CLASSES } from './property-map';
import { collectPhysicalDeclarations, type DraftScannerFinding } from './parser';

const DEFAULT_SCAN_SCOPE: Required<ScanScopeConfig> = {
  include: ['/src/stories/', '\\src\\stories\\', '.stories.', '.module.css'],
  exclude: [],
};

function escapeCssIdentifier(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function escapeAttributeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function shortenClassToken(token: string): string {
  const cssModuleHashMatch = token.match(/^(?<base>.+)_(?<hash>[a-z0-9]{5,})$/i);
  if (!cssModuleHashMatch?.groups) {
    return token;
  }

  const { base, hash } = cssModuleHashMatch.groups;
  if (!base || !hash || !/\d/.test(hash)) {
    return token;
  }

  return base;
}

function safeClassName(element: Element): string {
  if (typeof element.className === 'string') {
    return element.className;
  }
  const className = (element.className as { baseVal?: string } | undefined)?.baseVal;
  return typeof className === 'string' ? className : '';
}

export function elementHint(element: Element): string {
  const testId = element.getAttribute('data-testid');
  if (testId) {
    return `[data-testid="${escapeAttributeValue(testId)}"]`;
  }

  const identifier = element.getAttribute('data-flow-direction-label');
  if (identifier) {
    return `[data-flow-direction-label="${escapeAttributeValue(identifier)}"]`;
  }

  const id = element.id ? `#${escapeCssIdentifier(element.id)}` : '';
  const firstClass = safeClassName(element).trim().split(/\s+/).filter(Boolean)[0];
  const className = firstClass ? `.${escapeCssIdentifier(shortenClassToken(firstClass))}` : '';
  return `${element.tagName.toLowerCase()}${id}${className}`.slice(0, 64);
}

function isPositioned(element: Element): boolean {
  const position = window.getComputedStyle(element).position;
  return ['relative', 'absolute', 'fixed', 'sticky'].includes(position);
}

function shouldKeepForElement(finding: DraftScannerFinding, element: Element): boolean {
  if (!POSITION_DEPENDENT_PROPERTIES.has(finding.property)) {
    return true;
  }
  return isPositioned(element);
}

function ruleDeclarationBlock(rule: CSSStyleRule): string {
  const cssText = rule.cssText;
  const start = cssText.indexOf('{');
  const end = cssText.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return rule.style.cssText;
  }
  return cssText.slice(start + 1, end).trim();
}

function* iterateStyleRules(ruleList: CSSRuleList): Generator<CSSStyleRule> {
  for (const rule of Array.from(ruleList)) {
    if (rule instanceof CSSStyleRule) {
      yield rule;
      continue;
    }
    if ('cssRules' in rule) {
      yield* iterateStyleRules((rule as CSSGroupingRule).cssRules);
    }
  }
}

function stripStatefulPseudoClasses(selector: string): string {
  let sanitized = selector;
  for (const pseudo of STATEFUL_PSEUDO_CLASSES) {
    const pattern = new RegExp(`:${pseudo}(?![a-zA-Z0-9-])`, 'g');
    sanitized = sanitized.replace(pattern, '');
  }
  return sanitized;
}

function stripPseudoElements(selector: string): string {
  return selector.replace(/::(before|after|first-line|first-letter|marker|placeholder)/g, '');
}

function selectorCandidates(selectorText: string): string[] {
  const original = selectorText.trim();
  const stripped = stripPseudoElements(stripStatefulPseudoClasses(original)).trim();
  return Array.from(new Set([original, stripped])).filter(Boolean);
}

function selectorTargets(container: ParentNode, selectorText: string): Element[] {
  const matches = new Set<Element>();
  const containerElement = container instanceof Element ? container : null;
  const candidates = selectorCandidates(selectorText);

  for (const candidate of candidates) {
    try {
      if (containerElement?.matches(candidate)) {
        matches.add(containerElement);
      }
      container.querySelectorAll(candidate).forEach((element) => matches.add(element));
    } catch {
      // Ignore unsupported selector fragments.
    }
  }

  return Array.from(matches);
}

function styleSheetSource(styleSheet: CSSStyleSheet): string {
  if (styleSheet.href) {
    return styleSheet.href;
  }

  const ownerNode = styleSheet.ownerNode;
  if (!ownerNode || !(ownerNode instanceof Element)) {
    return '';
  }

  return (
    ownerNode.getAttribute('data-vite-dev-id') ||
    ownerNode.getAttribute('href') ||
    ownerNode.getAttribute('data-source') ||
    ownerNode.getAttribute('data-file') ||
    ''
  );
}

function matchesRule(source: string, match: ScanScopeMatch): boolean {
  if (typeof match === 'string') {
    return source.toLowerCase().includes(match.toLowerCase());
  }

  match.lastIndex = 0;
  return match.test(source);
}

function isStoryOwnedStyleSheet(styleSheet: CSSStyleSheet, scanScope?: ScanScopeConfig): boolean {
  const source = styleSheetSource(styleSheet);
  if (!source) {
    return false;
  }

  const include = scanScope?.include?.length ? scanScope.include : DEFAULT_SCAN_SCOPE.include;
  const exclude = scanScope?.exclude ?? DEFAULT_SCAN_SCOPE.exclude;

  const included = include.some((matcher) => matchesRule(source, matcher));
  if (!included) {
    return false;
  }

  return !exclude.some((matcher) => matchesRule(source, matcher));
}

export function stylesheetFindings(
  container: ParentNode,
  scanScope?: ScanScopeConfig,
): Array<{ target: Element; finding: DraftScannerFinding }> {
  const matches: Array<{ target: Element; finding: DraftScannerFinding }> = [];

  for (const styleSheet of Array.from(document.styleSheets)) {
    if (!isStoryOwnedStyleSheet(styleSheet, scanScope)) {
      continue;
    }

    let cssRules: CSSRuleList;
    try {
      cssRules = styleSheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of iterateStyleRules(cssRules)) {
      const declarations = collectPhysicalDeclarations(ruleDeclarationBlock(rule), 'stylesheet', rule.selectorText);
      if (declarations.length === 0) {
        continue;
      }

      const targets = selectorTargets(container, rule.selectorText);
      for (const target of targets) {
        for (const declaration of declarations) {
          if (!shouldKeepForElement(declaration, target)) {
            continue;
          }
          matches.push({ target, finding: declaration });
        }
      }
    }
  }

  return matches;
}

export function inlineStyleFindings(container: ParentNode): Array<{ target: Element; finding: DraftScannerFinding }> {
  const matches: Array<{ target: Element; finding: DraftScannerFinding }> = [];
  const nodes = container instanceof Element ? [container, ...Array.from(container.querySelectorAll('*'))] : [];

  for (const node of nodes) {
    const inlineStyle = node.getAttribute('style');
    if (!inlineStyle) {
      continue;
    }

    const declarations = collectPhysicalDeclarations(inlineStyle, 'inline');
    for (const declaration of declarations) {
      if (!shouldKeepForElement(declaration, node)) {
        continue;
      }
      matches.push({ target: node, finding: declaration });
    }
  }

  return matches;
}
