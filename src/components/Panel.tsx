import { CopyIcon, SearchIcon } from '@storybook/icons';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { AddonPanel, Button, EmptyTabContent, IconButton } from 'storybook/internal/components';
import { useAddonState, useChannel } from 'storybook/manager-api';
import { ADDON_ID, EVENTS } from '../constants';
import type { ScannerFinding, ScannerGroup, ScannerPayload } from '../types';
import {
  ActionRow,
  FindingCard,
  FindingLabel,
  FindingLine,
  FindingMeta,
  FocusButton,
  GroupCard,
  GroupHeader,
  HeaderRow,
  OriginBadge,
  PanelHeader,
  PanelLayout,
  RowActions,
  ScrollArea,
  SearchInput,
  SearchWrapper,
  SectionCard,
  SectionHeader,
  SourceScopeNote,
  StatusPill,
} from './Panel.styles';

interface PanelProps {
  active?: boolean;
}

type OffenderSection =
  | 'Spacing (physical -> logical)'
  | 'Positioning (physical -> logical)'
  | 'Sizing (physical -> logical)'
  | 'Scroll and overflow axis'
  | 'Text direction'
  | 'Other directional issues';

function classifyFinding(property: string): OffenderSection {
  // Keep findings in teaching-oriented buckets so users can triage by concept, not raw property list.
  if (property === 'text-align') {
    return 'Text direction';
  }
  if (property === 'left' || property === 'right' || property === 'top' || property === 'bottom') {
    return 'Positioning (physical -> logical)';
  }
  if (
    property === 'width' ||
    property === 'height' ||
    property === 'min-width' ||
    property === 'min-height' ||
    property === 'max-width' ||
    property === 'max-height' ||
    property === 'contain-intrinsic-width' ||
    property === 'contain-intrinsic-height' ||
    property === 'resize'
  ) {
    return 'Sizing (physical -> logical)';
  }
  if (
    property.startsWith('scroll-') ||
    property === 'overflow' ||
    property === 'overflow-x' ||
    property === 'overflow-y' ||
    property === 'overscroll-behavior' ||
    property === 'overscroll-behavior-x' ||
    property === 'overscroll-behavior-y'
  ) {
    return 'Scroll and overflow axis';
  }
  if (property === 'float' || property === 'clear') {
    return 'Text direction';
  }
  if (property.startsWith('padding') || property.startsWith('margin') || property.startsWith('border')) {
    return 'Spacing (physical -> logical)';
  }
  return 'Other directional issues';
}

function getWhyMessage(property: string, value: string): string {
  if (
    property === 'width' ||
    property === 'height' ||
    property === 'min-width' ||
    property === 'min-height' ||
    property === 'max-width' ||
    property === 'max-height' ||
    property === 'contain-intrinsic-width' ||
    property === 'contain-intrinsic-height'
  ) {
    return `This uses a physical size axis (${property}). Inline/block sizing adapts automatically when writing mode changes.`;
  }
  if (property === 'resize') {
    return `This uses "${value}" on a physical axis. Use inline/block resize values so handles follow writing mode.`;
  }
  if (
    property.startsWith('scroll-') ||
    property === 'overflow' ||
    property === 'overflow-x' ||
    property === 'overflow-y' ||
    property === 'overscroll-behavior' ||
    property === 'overscroll-behavior-x' ||
    property === 'overscroll-behavior-y'
  ) {
    return `This uses a physical scroll axis (${property}). Inline/block axis values stay correct in RTL and vertical writing modes.`;
  }
  if (property.startsWith('padding') || property.startsWith('margin') || property.startsWith('border')) {
    return `This hard-codes a physical side (${property}), so inline flow changes can shift spacing or borders to the wrong edge.`;
  }
  if (property === 'left' || property === 'right' || property === 'top' || property === 'bottom') {
    return `This pins layout to physical ${property}. In RTL or vertical writing, the inline start/end axis changes and this can place content incorrectly.`;
  }
  if (property === 'text-align') {
    return `This locks text to "${value}". Direction-aware alignment should follow inline start/end instead.`;
  }
  if (property === 'float' || property === 'clear') {
    return `This uses physical ${property} direction (${value}) and can reverse under RTL or vertical flows.`;
  }
  return 'This uses a physical direction that may not match inline start/end in RTL or vertical modes.';
}

function sourceHint(finding: ScannerFinding): string {
  // Source hints tell users where to edit: inline style or specific stylesheet selector.
  if (finding.origin === 'inline') {
    return 'from inline style';
  }
  return finding.ruleSelector ? `from ${finding.ruleSelector}` : 'from stylesheet rule';
}

function filterGroups(groups: ScannerGroup[], search: string): ScannerGroup[] {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      findings: group.findings.filter((finding) => {
        return (
          finding.property.toLowerCase().includes(normalizedSearch) ||
          finding.value.toLowerCase().includes(normalizedSearch) ||
          finding.suggestion.toLowerCase().includes(normalizedSearch) ||
          finding.selector.toLowerCase().includes(normalizedSearch) ||
          finding.origin.toLowerCase().includes(normalizedSearch) ||
          finding.ruleSelector?.toLowerCase().includes(normalizedSearch)
        );
      }),
    }))
    .filter((group) => group.findings.length > 0);
}

type SectionGroup = { element: string; findings: ScannerFinding[] };
type SectionEntry = { section: OffenderSection; groups: SectionGroup[] };

function buildSectionEntries(groups: ScannerGroup[]): SectionEntry[] {
  const sectionMap = new Map<OffenderSection, Map<string, ScannerFinding[]>>();

  for (const group of groups) {
    for (const finding of group.findings) {
      const section = classifyFinding(finding.property);
      if (!sectionMap.has(section)) {
        sectionMap.set(section, new Map<string, ScannerFinding[]>());
      }

      const groupedByElement = sectionMap.get(section);
      if (!groupedByElement) {
        continue;
      }
      if (!groupedByElement.has(group.element)) {
        groupedByElement.set(group.element, []);
      }
      groupedByElement.get(group.element)?.push(finding);
    }
  }

  const sectionOrder: OffenderSection[] = [
    'Spacing (physical -> logical)',
    'Positioning (physical -> logical)',
    'Sizing (physical -> logical)',
    'Scroll and overflow axis',
    'Text direction',
    'Other directional issues',
  ];

  // Keep a stable teaching-first order so the panel reads from common layout issues to edge cases.
  return sectionOrder
    .map((section) => {
      const grouped = sectionMap.get(section);
      if (!grouped || grouped.size === 0) {
        return null;
      }
      return {
        section,
        groups: Array.from(grouped.entries()).map(([element, findings]) => ({ element, findings })),
      };
    })
    .filter((entry): entry is SectionEntry => entry !== null);
}

export const Panel: React.FC<PanelProps> = memo(function FlowDirectionPanel(props: PanelProps) {
  // Persist scan state per-addon in manager so panel rerenders remain stable.
  const [{ groups, scannedElements, totalFindings }, setState] = useAddonState<ScannerPayload>(ADDON_ID, {
    groups: [],
    scannedElements: 0,
    totalFindings: 0,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Listen for preview scan responses and hydrate manager-side panel state.
  const emit = useChannel({
    [EVENTS.SCAN_RESULT]: (payload: ScannerPayload) => {
      setState(payload);
      setIsScanning(false);
    },
  });

  const requestScan = useCallback(() => {
    setIsScanning(true);
    emit(EVENTS.SCAN_REQUEST);
  }, [emit]);

  const copyToClipboard = useCallback(async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1200);
  }, []);

  const filteredGroups = useMemo(() => filterGroups(groups, search), [groups, search]);
  const filteredFindingsCount = useMemo(
    () => filteredGroups.reduce((total, group) => total + group.findings.length, 0),
    [filteredGroups],
  );
  const sectionEntries = useMemo(() => buildSectionEntries(filteredGroups), [filteredGroups]);

  const copyAllPayload = useMemo(() => {
    if (filteredGroups.length === 0) {
      return 'No flow-direction findings for current filter.';
    }

    return filteredGroups
      .map((group) => {
        const lines = group.findings.map(
          (finding) =>
            `- ${finding.property}: ${finding.value} -> ${finding.suggestion} | ${getWhyMessage(finding.property, finding.value)} | ${sourceHint(finding)}`,
        );
        return `### ${group.element}\n${lines.join('\n')}`;
      })
      .join('\n\n');
  }, [filteredGroups]);

  return (
    <AddonPanel active={props.active ?? false}>
      <PanelLayout>
        <PanelHeader>
          <HeaderRow>
            <strong>
              {isScanning ? 'Scanning...' : `${filteredGroups.length} elements, ${filteredFindingsCount} findings`}
            </strong>
            <StatusPill $warning={filteredFindingsCount > 0}>
              {filteredFindingsCount > 0 ? 'Needs attention' : 'All clear'}
            </StatusPill>
          </HeaderRow>

          <div>
            Scanned {scannedElements} nodes. Total findings: {totalFindings}.
          </div>

          <SourceScopeNote>Scanning story-local styles only</SourceScopeNote>

          <ActionRow>
            <Button onClick={requestScan}>{isScanning ? 'Scanning...' : 'Re-scan'}</Button>
            <Button
              disabled={filteredGroups.length === 0}
              onClick={() => {
                void copyToClipboard(copyAllPayload, 'all');
              }}
            >
              {copiedId === 'all' ? 'Copied learning notes' : 'Copy all findings'}
            </Button>
          </ActionRow>

          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              aria-label="Filter findings"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search by selector, property, value, replacement, or source"
            />
          </SearchWrapper>
        </PanelHeader>

        {sectionEntries.length === 0 ? (
          <EmptyTabContent
            title="All clear in this story"
            description="No directional offenders found. Open the matching Broken story to demonstrate detection."
          />
        ) : (
          <ScrollArea>
            {sectionEntries.map((entry) => (
              <SectionCard key={entry.section}>
                <SectionHeader>{entry.section}</SectionHeader>
                {entry.groups.map((group) => (
                  <GroupCard key={`${entry.section}-${group.element}`}>
                    <GroupHeader>{group.element}</GroupHeader>
                    {group.findings.map((finding) => {
                      const rowCopy = `${finding.property}: ${finding.value} -> ${finding.suggestion}\nWhy: ${getWhyMessage(
                        finding.property,
                        finding.value,
                      )}\nSource: ${sourceHint(finding)}`;
                      return (
                        <FindingCard key={finding.findingId}>
                          <FindingLine>
                            <FindingLabel>Offender</FindingLabel>
                            <OriginBadge $origin={finding.origin}>{finding.origin}</OriginBadge>
                            <code>{finding.property}</code>
                            <span>=</span>
                            <code>{finding.value}</code>
                          </FindingLine>

                          <FindingLine>
                            <FindingLabel>Why this fails</FindingLabel>
                            <span>{getWhyMessage(finding.property, finding.value)}</span>
                          </FindingLine>

                          <FindingLine>
                            <FindingLabel>Use instead</FindingLabel>
                            <code>{finding.suggestion}</code>
                          </FindingLine>

                          <FindingMeta>{sourceHint(finding)}</FindingMeta>

                          <RowActions>
                            <FocusButton
                              onClick={() => {
                                emit(EVENTS.FOCUS_FINDING, {
                                  selector: finding.selector,
                                  findingId: finding.findingId,
                                });
                              }}
                            >
                              Focus offender
                            </FocusButton>
                            <IconButton
                              title="Copy finding"
                              onClick={() => {
                                void copyToClipboard(rowCopy, finding.findingId);
                              }}
                            >
                              <CopyIcon />
                            </IconButton>
                          </RowActions>
                        </FindingCard>
                      );
                    })}
                  </GroupCard>
                ))}
              </SectionCard>
            ))}
          </ScrollArea>
        )}
      </PanelLayout>
    </AddonPanel>
  );
});
