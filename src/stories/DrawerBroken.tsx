import React from 'react';
import clsx from 'clsx';
import styles from './Drawer.module.css';

export function DrawerBroken() {
  return (
    <aside data-testid="drawer-root" className={styles.drawer}>
      <span data-testid="drawer-label" className={clsx(styles.label, styles.physicalLabel)}>
        PINNED
      </span>
      <h3 className={styles.title}>Release checklist</h3>
      <p className={styles.description}>This panel intentionally relies on physical properties for scanner demos.</p>
      <ul data-testid="drawer-list" className={clsx(styles.list, styles.physicalList)}>
        <li>Scan for physical properties</li>
        <li>Review focus targets</li>
        <li>Capture visual snapshots</li>
      </ul>
      <span data-testid="drawer-handle" className={clsx(styles.handle, styles.physicalHandle)} />
      <button type="button" data-testid="drawer-close" className={clsx(styles.close, styles.physicalClose)}>
        x
      </button>
    </aside>
  );
}
