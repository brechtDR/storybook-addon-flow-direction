import React from 'react';
import styles from './StaticCard.module.css';

export function StaticCard() {
  return (
    <article className={`static-card ${styles.card} ${styles.workingAccent}`}>
      <h3 className={styles.title}>Static card selector sample</h3>
      <p className={`static-card-body ${styles.body}`}>
        This card uses logical properties and keeps a stable semantic class token for focus targeting.
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
