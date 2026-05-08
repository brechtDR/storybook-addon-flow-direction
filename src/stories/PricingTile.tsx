import React from 'react';
import styles from './PricingTile.module.css';

export function PricingTile() {
  return (
    <section data-testid="pricing-tile-root" className={styles.tile}>
      <header className={styles.header}>
        <h3 className={styles.plan}>Team Plan</h3>
        <p className={styles.price}>$39</p>
      </header>
      <ul data-testid="pricing-features-list" className={styles.features}>
        <li>Unlimited projects</li>
        <li>Role-based permissions</li>
        <li>Priority support</li>
      </ul>
      <button type="button" data-testid="pricing-cta" className={styles.cta}>
        Start free trial
      </button>
    </section>
  );
}
