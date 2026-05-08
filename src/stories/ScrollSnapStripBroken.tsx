import React from 'react';
import clsx from 'clsx';
import styles from './ScrollSnapStrip.module.css';

const SNAP_ITEMS = [
  { title: 'Account', copy: 'This version intentionally uses physical x-axis scrolling and sizing.' },
  { title: 'Billing', copy: 'The scanner should flag width, height, overflow-x, and scroll snap axis values.' },
  { title: 'Members', copy: 'Physical scroll margins and paddings are included for teaching examples.' },
  { title: 'Integrations', copy: 'Compare this with Working/Scroll Snap under RTL and vertical writing modes.' },
];

export function ScrollSnapStripBroken() {
  return (
    <section
      data-testid="scroll-snap-root"
      className={clsx(styles.viewport, styles.physicalCss)}
      style={{ overflowX: 'auto', overflowY: 'hidden' }}
    >
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
