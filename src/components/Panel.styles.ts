import { Button } from 'storybook/internal/components';
import { styled } from 'storybook/theming';
import type { ScannerFinding } from '../types';

export const PanelLayout = styled.div({
  blockSize: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const PanelHeader = styled.div(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: '12px',
  borderBlockEnd: `1px solid ${theme.appBorderColor}`,
  background: theme.background.content,
  display: 'grid',
  gap: '10px',
}));

export const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
});

export const SourceScopeNote = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  inlineSize: 'fit-content',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: '11px',
  fontWeight: 700,
  background: `${theme.color.secondary}20`,
  color: theme.color.secondary,
}));

export const StatusPill = styled.span<{ $warning: boolean }>(({ $warning, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: '11px',
  fontWeight: 700,
  background: $warning ? `${theme.color.warning}20` : `${theme.color.positive}20`,
  color: $warning ? theme.color.warning : theme.color.positive,
}));

export const ActionRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

export const SearchWrapper = styled.label(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 6,
  paddingInline: '8px',
  background: theme.background.content,
}));

export const SearchInput = styled.input(({ theme }) => ({
  inlineSize: '100%',
  border: 0,
  background: 'transparent',
  color: theme.color.defaultText,
  paddingBlock: '6px',
  fontSize: '12px',
  outline: 'none',
}));

export const ScrollArea = styled.div({
  overflow: 'auto',
  padding: '12px',
  display: 'grid',
  gap: '10px',
});

export const SectionCard = styled.section(({ theme }) => ({
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 8,
  overflow: 'hidden',
}));

export const SectionHeader = styled.header(({ theme }) => ({
  padding: '8px 10px',
  borderBlockEnd: `1px solid ${theme.appBorderColor}`,
  background: theme.background.hoverable,
  fontSize: '12px',
  fontWeight: 700,
}));

export const GroupCard = styled.section(({ theme }) => ({
  borderBlockEnd: `1px solid ${theme.appBorderColor}`,
  '&:last-of-type': {
    borderBlockEnd: 0,
  },
}));

export const GroupHeader = styled.header(({ theme }) => ({
  padding: '8px 10px',
  fontFamily: theme.typography.fonts.mono,
  fontSize: '12px',
  background: theme.background.content,
}));

export const FindingCard = styled.div(({ theme }) => ({
  margin: '8px',
  padding: '8px 10px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 8,
  display: 'grid',
  gap: '8px',
  '&:hover': {
    background: theme.background.hoverable,
  },
}));

export const FindingLine = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
});

export const FindingLabel = styled.span(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 700,
  color: theme.color.mediumdark,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
}));

export const FindingMeta = styled.div(({ theme }) => ({
  color: theme.color.mediumdark,
  fontSize: '11px',
}));

export const OriginBadge = styled.span<{ $origin: ScannerFinding['origin'] }>(({ $origin, theme }) => ({
  display: 'inline-flex',
  inlineSize: 'fit-content',
  borderRadius: 999,
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  padding: '1px 6px',
  background: $origin === 'inline' ? `${theme.color.orange}20` : `${theme.color.gold}20`,
  color: $origin === 'inline' ? theme.color.orange : theme.color.gold,
}));

export const RowActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '6px',
});

export const FocusButton = styled(Button)({
  minInlineSize: '5.25rem',
});
