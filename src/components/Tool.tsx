import { CheckIcon, GridAltIcon, MarkupIcon, TransferIcon, UndoIcon } from '@storybook/icons';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { IconButton, WithTooltip } from 'storybook/internal/components';
import { useGlobals, useParameter } from 'storybook/manager-api';
import { KEY_DIRECTION, KEY_MATRIX, KEY_WRITING_MODE, PARAM_KEY, TOOL_ID } from '../constants';
import {
  clampDirection,
  clampWritingMode,
  resolveSupportedDirections,
  resolveSupportedWritingModes,
} from '../flow-direction-support';
import type { FlowDirection, FlowDirectionParameters, FlowWritingMode } from '../types';
import { Divider, MenuContainer, OptionButton, OptionText, SectionLabel } from './Tool.styles';

interface FlowMenuProps {
  writingMode: FlowWritingMode;
  direction: FlowDirection;
  matrix: boolean;
  writingModes: FlowWritingMode[];
  directions: FlowDirection[];
  onWritingMode: (value: FlowWritingMode) => void;
  onDirection: (value: FlowDirection) => void;
  onMatrixToggle: () => void;
  onReset: () => void;
}

// Presentational menu only: business logic stays in the toolbar wrapper below.
function FlowMenu({
  writingMode,
  direction,
  matrix,
  writingModes,
  directions,
  onWritingMode,
  onDirection,
  onMatrixToggle,
  onReset,
}: FlowMenuProps): React.JSX.Element {
  return (
    <MenuContainer>
      <SectionLabel>Writing mode</SectionLabel>
      {writingModes.map((mode) => (
        <OptionButton
          key={mode}
          $active={mode === writingMode}
          aria-pressed={mode === writingMode}
          onClick={() => onWritingMode(mode)}
        >
          <OptionText>
            <TransferIcon />
            {mode}
          </OptionText>
          {mode === writingMode ? <CheckIcon /> : null}
        </OptionButton>
      ))}

      <Divider />

      <SectionLabel>Direction</SectionLabel>
      {directions.map((value) => (
        <OptionButton
          key={value}
          $active={value === direction}
          aria-pressed={value === direction}
          onClick={() => onDirection(value)}
        >
          <OptionText>
            <MarkupIcon />
            {value.toUpperCase()}
          </OptionText>
          {value === direction ? <CheckIcon /> : null}
        </OptionButton>
      ))}

      <Divider />

      <OptionButton $active={matrix} aria-pressed={matrix} onClick={onMatrixToggle}>
        <OptionText>
          <GridAltIcon />
          Matrix mode
        </OptionText>
        {matrix ? <CheckIcon /> : null}
      </OptionButton>

      <OptionButton onClick={onReset}>
        <OptionText>
          <UndoIcon />
          Reset defaults
        </OptionText>
      </OptionButton>
    </MenuContainer>
  );
}

export const Tool = memo(function FlowDirectionTool() {
  // Globals are the shared state between manager UI and preview decorators.
  const [globals, updateGlobals] = useGlobals();
  const flowParams = useParameter(PARAM_KEY, undefined) as FlowDirectionParameters | undefined;
  const { writingModes, directions } = useMemo(
    () => ({
      writingModes: resolveSupportedWritingModes(flowParams),
      directions: resolveSupportedDirections(flowParams),
    }),
    [flowParams],
  );

  const defaultWritingMode = clampWritingMode(undefined, writingModes);
  const defaultDirection = clampDirection(undefined, directions);
  const writingMode = (globals[KEY_WRITING_MODE] as FlowWritingMode | undefined) ?? defaultWritingMode;
  const direction = (globals[KEY_DIRECTION] as FlowDirection | undefined) ?? defaultDirection;
  const matrix = Boolean(globals[KEY_MATRIX]);

  useEffect(() => {
    const clampedWritingMode = clampWritingMode(writingMode, writingModes);
    const clampedDirection = clampDirection(direction, directions);
    const patches: Record<string, string> = {};

    if (clampedWritingMode !== writingMode) {
      patches[KEY_WRITING_MODE] = clampedWritingMode;
    }
    if (clampedDirection !== direction) {
      patches[KEY_DIRECTION] = clampedDirection;
    }

    if (Object.keys(patches).length > 0) {
      updateGlobals(patches);
    }
  }, [directions, direction, updateGlobals, writingMode, writingModes]);

  const setWritingMode = useCallback(
    (value: FlowWritingMode) => {
      updateGlobals({ [KEY_WRITING_MODE]: value });
    },
    [updateGlobals],
  );

  const setDirection = useCallback(
    (value: FlowDirection) => {
      updateGlobals({ [KEY_DIRECTION]: value });
    },
    [updateGlobals],
  );

  const toggleMatrix = useCallback(() => {
    updateGlobals({ [KEY_MATRIX]: !matrix });
  }, [matrix, updateGlobals]);

  const resetDefaults = useCallback(() => {
    updateGlobals({
      [KEY_WRITING_MODE]: defaultWritingMode,
      [KEY_DIRECTION]: defaultDirection,
      [KEY_MATRIX]: false,
    });
  }, [defaultDirection, defaultWritingMode, updateGlobals]);

  // Highlight the toolbar button when current globals differ from defaults.
  const isActive = writingMode !== defaultWritingMode || direction !== defaultDirection || matrix;
  const label = `${writingMode}, ${direction.toUpperCase()}${matrix ? ', matrix' : ''}`;

  return (
    <WithTooltip
      hasChrome
      placement="bottom"
      trigger="click"
      tooltip={
        <FlowMenu
          writingMode={writingMode}
          direction={direction}
          matrix={matrix}
          directions={directions}
          writingModes={writingModes}
          onWritingMode={setWritingMode}
          onDirection={setDirection}
          onMatrixToggle={toggleMatrix}
          onReset={resetDefaults}
        />
      }
    >
      <IconButton key={TOOL_ID} active={isActive} title={`Flow direction: ${label}`}>
        <TransferIcon />
        {writingMode !== defaultWritingMode ? writingMode : direction.toUpperCase()}
      </IconButton>
    </WithTooltip>
  );
});
