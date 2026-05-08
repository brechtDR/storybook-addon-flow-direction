import React from 'react';
import styles from './FlowCard.module.css';

export function FlowCard() {
  return (
    <article data-testid="card-root" className={`${styles.card} ${styles.workingAccent}`}>
      <span className={styles.tag}>Flow Direction</span>
      <h3 className={styles.title}>Localization guard rails</h3>
      <p className={styles.body}>
        Use logical properties to keep spacing and alignment stable in RTL and vertical scripts.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary}>
          Save
        </button>
        <button type="button" data-testid="card-css-button" className={styles.secondary}>
          CSS module state
        </button>
      </div>
    </article>
  );
}
