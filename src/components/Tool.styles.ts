import { styled } from 'storybook/theming';

export const MenuContainer = styled.div(({ theme }) => ({
  inlineSize: 270,
  padding: '8px',
  background: theme.background.content,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 8,
  boxShadow: theme.appBorderShadow,
  display: 'grid',
  gap: '8px',
}));

export const SectionLabel = styled.div(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 700,
  color: theme.color.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  padding: '0 6px',
}));

export const OptionButton = styled.button<{ $active?: boolean }>(({ $active, theme }) => ({
  inlineSize: '100%',
  border: 0,
  borderRadius: 6,
  background: $active ? theme.background.hoverable : 'transparent',
  color: theme.color.defaultText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '6px 8px',
  cursor: 'pointer',
  textAlign: 'left',
  '&:hover': {
    background: theme.background.hoverable,
  },
}));

export const OptionText = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
});

export const Divider = styled.div(({ theme }) => ({
  blockSize: 1,
  background: theme.appBorderColor,
  margin: '2px 0',
}));
