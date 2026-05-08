import React from 'react';
import styles from './Toast.module.css';

export function Toast() {
  return (
    <section data-testid="toast-root" className={styles.toast}>
      <span data-testid="toast-icon" className={styles.icon}>
        i
      </span>
      <span data-testid="toast-accent" className={styles.accent} />
      <p data-testid="toast-body" className={styles.body}>
        Your flow-direction scan passed. Logical spacing and alignment are stable for RTL and vertical layouts.
      </p>
      <p className={styles.meta}>Updated a few seconds ago</p>
      <button type="button" data-testid="toast-close" className={styles.close}>
        x
      </button>
    </section>
  );
}
