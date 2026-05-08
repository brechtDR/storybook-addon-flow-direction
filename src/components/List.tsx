import React, { Fragment, useState } from 'react';
import { Description, HeaderBar, Icon, ListWrapper, Wrapper } from './List.styles';

type Item = {
  title: string;
  description: string;
};

interface ListItemProps {
  item: Item;
}

interface ListProps {
  items: Item[];
}

// Small accordion row used for expandable helper content in manager surfaces.
export const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const [open, onToggle] = useState(false);

  return (
    <Fragment>
      <Wrapper>
        <HeaderBar type="button" aria-expanded={open} onClick={() => onToggle(!open)}>
          <Icon
            style={{
              transform: `rotate(${open ? 0 : -90}deg)`,
            }}
          />
          {item.title}
        </HeaderBar>
      </Wrapper>
      {open ? <Description>{item.description}</Description> : null}
    </Fragment>
  );
};

// Lightweight list wrapper for multiple accordion rows.
export const List: React.FC<ListProps> = ({ items }) => (
  <ListWrapper>
    {items.map((item) => (
      <ListItem key={item.title} item={item}></ListItem>
    ))}
  </ListWrapper>
);
