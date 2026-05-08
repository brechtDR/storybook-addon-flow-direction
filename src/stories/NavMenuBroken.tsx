import React from 'react';
import clsx from 'clsx';
import styles from './NavMenu.module.css';

const ITEMS = ['Overview', 'Billing', 'Members', 'Integrations'];

export function NavMenuBroken() {
  return (
    <nav data-testid="nav-root" className={clsx(styles.nav, styles.physicalCss)}>
      <ul className={styles.list}>
        {ITEMS.map((item, index) => {
          const isActive = index === 1;
          return (
            <li
              key={item}
              data-testid={`nav-item-${item.toLowerCase()}`}
              className={clsx(styles.item, isActive && styles.active)}
            >
              {item}
              {index < ITEMS.length - 1 ? <span className={styles.chevron}>{'>'}</span> : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
