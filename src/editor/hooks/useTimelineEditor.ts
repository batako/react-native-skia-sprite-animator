import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Options for {@link useTimelineEditor}.
 */
export interface UseTimelineEditorOptions {
  /** Initial selection index when hook mounts. */
  initialSelectedIndex?: number | null;
  /** Called before the selection changes. */
  onBeforeSelectionChange?: () => void;
}

/**
 * Return type of {@link useTimelineEditor}.
 */
export interface UseTimelineEditorResult {
  /** Clipboard captured from timeline selections. */
  clipboard: number[] | null;
  /** Whether clipboard currently has data. */
  hasClipboard: boolean;
  /** Selected timeline index or null. */
  selectedIndex: number | null;
  /** Height measured for the timeline viewport. */
  measuredHeight: number;
  /** Height currently filled by cards/content. */
  filledHeight: number;
  /** Sets the selected index, firing before-change hook. */
  setSelectedIndex: (value: SetStateAction<number | null>) => void;
  /** Sets the clipboard payload. */
  setClipboard: Dispatch<SetStateAction<number[] | null>>;
  /** Copies the selected frame index from a sequence. */
  copySelection: (sequence: number[], indexOverride?: number | null) => number[] | null;
  /** Clears clipboard contents. */
  clearClipboard: () => void;
  /** Stores the measured height of the panel. */
  setMeasuredHeight: (height: number) => void;
  /** Updates the filled height with arbitrary logic. */
  updateFilledHeight: (updater: (prev: number) => number) => void;
}

/**
 * Handles clipboard and selection state for the timeline UI.
 */
export const useTimelineEditor = ({
  initialSelectedIndex = null,
  onBeforeSelectionChange,
}: UseTimelineEditorOptions = {}): UseTimelineEditorResult => {
  const [clipboard, setClipboard] = useState<number[] | null>(null);
  const [selectedIndexState, setSelectedIndexState] = useState<number | null>(initialSelectedIndex);
  const [measuredHeight, setMeasuredHeightState] = useState(0);
  const [filledHeight, setFilledHeightState] = useState(0);

  const setSelectedIndex = useCallback(
    (value: SetStateAction<number | null>) => {
      if (onBeforeSelectionChange) {
        onBeforeSelectionChange();
      }
      setSelectedIndexState((prev) => {
        if (typeof value === 'function') {
          return (value as (current: number | null) => number | null)(prev);
        }
        return value;
      });
    },
    [onBeforeSelectionChange],
  );

  const setMeasuredHeight = useCallback((height: number) => {
    setMeasuredHeightState(height);
  }, []);

  const updateFilledHeight = useCallback((updater: (prev: number) => number) => {
    setFilledHeightState((prev) => updater(prev));
  }, []);

  const copySelection = useCallback(
    (sequence: number[], indexOverride: number | null = selectedIndexState) => {
      const index = indexOverride ?? selectedIndexState;
      if (index === null) {
        return null;
      }
      const frameIndex = sequence[index];
      if (typeof frameIndex !== 'number') {
        return null;
      }
      const payload = [frameIndex];
      setClipboard(payload);
      return payload;
    },
    [selectedIndexState],
  );

  const clearClipboard = useCallback(() => {
    setClipboard(null);
  }, []);

  const hasClipboard = useMemo(() => Boolean(clipboard?.length), [clipboard]);

  return {
    clipboard,
    hasClipboard,
    selectedIndex: selectedIndexState,
    measuredHeight,
    filledHeight,
    setSelectedIndex,
    setClipboard,
    copySelection,
    clearClipboard,
    setMeasuredHeight,
    updateFilledHeight,
  };
};
