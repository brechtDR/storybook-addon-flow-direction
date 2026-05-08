import assert from 'node:assert/strict';
import test from 'node:test';

import { shortenClassToken } from './dom';

test('keeps semantic hyphenated class names intact', () => {
  assert.equal(shortenClassToken('physical-toast'), 'physical-toast');
});

test('strips underscore hash suffix for css-module-like classes', () => {
  assert.equal(shortenClassToken('toast_a1b2c3'), 'toast');
});

test('keeps underscored class names without numeric hash suffix', () => {
  assert.equal(shortenClassToken('physical_toast'), 'physical_toast');
});
