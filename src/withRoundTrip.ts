import { useChannel, useEffect, useRef } from 'storybook/preview-api';
import type { DecoratorFunction } from 'storybook/internal/types';
import { EVENTS } from './constants';
import { focusOffender, scan } from './scanner';
import type { FlowDirectionParameters } from './types';

function scheduleDeferred(task: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const idleId = window.requestIdleCallback(task, { timeout: 120 });
    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
    };
  }

  const timeoutId = window.setTimeout(task, 100);
  return () => {
    window.clearTimeout(timeoutId);
  };
}

export const withRoundTrip: DecoratorFunction = (storyFn, context) => {
  const canvasRoot = context.canvasElement as ParentNode;
  const flowDirectionParameters = (context.parameters?.flowDirection ?? {}) as FlowDirectionParameters;
  const scanScope = flowDirectionParameters.scanScope;
  const cancelPendingScanRef = useRef<(() => void) | null>(null);

  const emit = useChannel({
    [EVENTS.SCAN_REQUEST]: () => emit(EVENTS.SCAN_RESULT, scan(canvasRoot, { scanScope })),
    [EVENTS.FOCUS_FINDING]: (payload: { selector?: string }) => focusOffender(canvasRoot, payload?.selector),
  });

  useEffect(() => {
    cancelPendingScanRef.current?.();
    cancelPendingScanRef.current = scheduleDeferred(() => {
      emit(EVENTS.SCAN_RESULT, scan(canvasRoot, { scanScope }));
    });

    return () => {
      cancelPendingScanRef.current?.();
      cancelPendingScanRef.current = null;
    };
  }, [canvasRoot, emit, scanScope]);

  return storyFn();
};
