import React from 'react';
import { useGlobals } from 'storybook/preview-api';
import type { Renderer, StoryContext, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { KEY_DIRECTION, KEY_MATRIX, KEY_WRITING_MODE } from './constants';
import {
  clampDirection,
  clampWritingMode,
  resolveSupportedDirections,
  resolveSupportedWritingModes,
} from './flow-direction-support';
import type { FlowDirection, FlowDirectionParameters, FlowWritingMode } from './types';

interface FlowWrapperProps {
  writingMode: FlowWritingMode;
  direction: FlowDirection;
  label?: string;
  children: React.ReactNode;
}

const wrapperStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  minBlockSize: '16rem',
  padding: '1rem',
  border: '1px solid rgb(127 127 127 / 22%)',
  borderRadius: 6,
  boxSizing: 'border-box',
  overflow: 'auto',
  background: 'var(--storybook-background, transparent)',
};

const matrixContainerStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
  blockSize: '100dvh',
  minBlockSize: '32rem',
  boxSizing: 'border-box',
  padding: '0.75rem',
};

const matrixCellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  minBlockSize: '18rem',
};

const matrixLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--storybook-color-secondary-text, #6b7280)',
};

function FlowWrapper({ writingMode, direction, label, children }: FlowWrapperProps) {
  return (
    <div style={matrixCellStyle}>
      {label ? <span style={matrixLabelStyle}>{label}</span> : null}
      <div
        data-flow-direction-wrapper
        data-flow-direction-label={label ?? `${writingMode}-${direction}`}
        style={{ ...wrapperStyle, writingMode, direction }}
        dir={direction}
      >
        {children}
      </div>
    </div>
  );
}

export const withGlobals = (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {
  const [globals] = useGlobals();
  const isInDocs = context.viewMode === 'docs';
  // Keep docs rendering untouched so docs pages do not inherit the flow wrapper/matrix chrome.
  if (isInDocs) {
    return StoryFn();
  }

  // Configure matrix combinations globally in `.storybook/preview.ts` via
  // `parameters.flowDirection.supportedWritingModes` and `parameters.flowDirection.supportedDirections`.
  const flowDirectionParameters = context.parameters?.flowDirection as FlowDirectionParameters | undefined;
  const supportedWritingModes = resolveSupportedWritingModes(flowDirectionParameters);
  const supportedDirections = resolveSupportedDirections(flowDirectionParameters);
  const writingMode = clampWritingMode(globals[KEY_WRITING_MODE] as FlowWritingMode | undefined, supportedWritingModes);
  const direction = clampDirection(globals[KEY_DIRECTION] as FlowDirection | undefined, supportedDirections);
  const parameterMatrix = Boolean(flowDirectionParameters?.matrix);
  const globalMatrix = Boolean(globals[KEY_MATRIX]);

  // Matrix mode can be enabled per-story via parameters or globally from the toolbar.
  if (parameterMatrix || globalMatrix) {
    return (
      <div
        data-flow-direction-matrix
        style={{
          ...matrixContainerStyle,
          gridTemplateColumns: `repeat(${supportedWritingModes.length}, minmax(0, 1fr))`,
        }}
      >
        {supportedWritingModes.flatMap((mode) =>
          supportedDirections.map((dir) => (
            <FlowWrapper key={`${mode}-${dir}`} writingMode={mode} direction={dir} label={`${mode} · ${dir}`}>
              {StoryFn()}
            </FlowWrapper>
          )),
        )}
      </div>
    );
  }

  return (
    <FlowWrapper writingMode={writingMode} direction={direction}>
      {StoryFn()}
    </FlowWrapper>
  );
};
