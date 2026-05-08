import React from 'react';
import styles from './Drawer.module.css';

export function Drawer() {
  return (
    <aside data-testid="drawer-root" className={styles.drawer}>
      <span data-testid="drawer-label" className={styles.label}>
        PINNED
      </span>
      <h3 className={styles.title}>Release checklist</h3>
      <p className={styles.description}>Everything in this panel is aligned with logical properties.</p>
      <ul data-testid="drawer-list" className={styles.list}>
        <li>Scan for physical properties</li>
        <li>Review focus targets</li>
        <li>Capture visual snapshots</li>
      </ul>
      <span data-testid="drawer-handle" className={styles.handle} />
      <button type="button" data-testid="drawer-close" className={styles.close}>
        x
      </button>
    </aside>
  );
}
