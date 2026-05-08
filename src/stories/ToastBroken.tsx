import React from 'react';
import clsx from 'clsx';
import styles from './Toast.module.css';

export function ToastBroken() {
  return (
    <section data-testid="toast-root" className={styles.toast}>
      <span data-testid="toast-icon" className={clsx(styles.icon, styles.physicalIcon)}>
        i
      </span>
      <span data-testid="toast-accent" className={clsx(styles.accent, styles.physicalAccent)} />
      <p data-testid="toast-body" className={clsx(styles.body, styles.physicalBody)}>
        This toast uses physical spacing and positioning so the scanner can highlight exact offenders.
      </p>
      <p className={styles.meta}>Updated a few seconds ago</p>
      <button type="button" data-testid="toast-close" className={clsx(styles.close, styles.physicalClose)}>
        x
      </button>
    </section>
  );
}
