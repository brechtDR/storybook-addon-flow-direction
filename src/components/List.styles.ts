import { ArrowDownIcon } from '@storybook/icons';
import { styled } from 'storybook/theming';

export const ListWrapper = styled.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: 0,
});

export const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  '&:hover': {
    background: theme.background.hoverable,
  },
}));

export const Icon = styled(ArrowDownIcon)(({ theme }) => ({
  height: 10,
  width: 10,
  minWidth: 10,
  color: theme.color.mediumdark,
  marginRight: 10,
  transition: 'transform 0.1s ease-in-out',
  alignSelf: 'center',
  display: 'inline-flex',
}));

export const HeaderBar = styled.button(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin - 3,
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  border: 0,
  borderLeft: '3px solid transparent',
  width: '100%',

  '&:focus-visible': {
    outline: '0 none',
    borderLeft: `3px solid ${theme.color.secondary}`,
  },
}));

export const Description = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  background: theme.background.content,
  fontFamily: theme.typography.fonts.mono,
  whiteSpace: 'pre-wrap',
  textAlign: 'left',
}));
