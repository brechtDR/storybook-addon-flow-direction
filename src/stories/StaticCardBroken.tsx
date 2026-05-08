import React from 'react';
import clsx from 'clsx';
import styles from './StaticCard.module.css';

export function StaticCardBroken() {
  return (
    <article className={clsx('static-card', styles.card, styles.physicalRoot)}>
      <h3 className={styles.title}>Static card selector sample</h3>
      <p className={clsx('static-card-body', styles.body, styles.physicalBody)}>
        This version intentionally uses physical properties so scanner findings can trigger Focus offender.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary}>
          Approve
        </button>
        <button type="button" className={styles.secondary}>
          Review
        </button>
      </div>
    </article>
  );
}
