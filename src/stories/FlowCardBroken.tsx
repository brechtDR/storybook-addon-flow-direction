import React from 'react';
import clsx from 'clsx';
import styles from './FlowCard.module.css';

export function FlowCardBroken() {
  return (
    <article data-testid="card-root" className={clsx(styles.card, styles.physicalCss)}>
      <span className={styles.tag}>Flow Direction</span>
      <h3 className={styles.title}>Localization guard rails</h3>
      <p className={styles.body}>
        This version intentionally uses physical properties so offenders are easy to detect.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary}>
          Save
        </button>
        <button
          type="button"
          data-testid="card-css-button"
          className={clsx(styles.secondary, styles.physicalCssButton)}
        >
          CSS module state
        </button>
      </div>
    </article>
  );
}
