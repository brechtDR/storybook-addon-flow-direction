import React from 'react';
import styles from './ScrollSnapStrip.module.css';

const SNAP_ITEMS = [
  { title: 'Account', copy: 'Inline-aware snap points keep focus movement stable across writing modes.' },
  { title: 'Billing', copy: 'Scroll padding follows inline start and end when direction flips.' },
  { title: 'Members', copy: 'Logical sizing avoids width and height assumptions in vertical scripts.' },
  { title: 'Integrations', copy: 'Using inline/block axes keeps story behavior consistent in matrix mode.' },
];

export function ScrollSnapStrip() {
  return (
    <section data-testid="scroll-snap-root" className={styles.viewport}>
      <ol className={styles.track}>
        {SNAP_ITEMS.map((item) => (
          <li key={item.title} data-testid={`scroll-snap-item-${item.title.toLowerCase()}`} className={styles.slide}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.copy}>{item.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
