import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export interface UseTimelineEditorOptions {
  initialSelectedIndex?: number | null;
  onBeforeSelectionChange?: () => void;
}

export interface UseTimelineEditorResult {
  clipboard: number[] | null;
  hasClipboard: boolean;
  selectedIndex: number | null;
  measuredHeight: number;
  filledHeight: number;
  setSelectedIndex: (value: SetStateAction<number | null>) => void;
  setClipboard: Dispatch<SetStateAction<number[] | null>>;
  copySelection: (sequence: number[], indexOverride?: number | null) => number[] | null;
  clearClipboard: () => void;
  setMeasuredHeight: (height: number) => void;
  updateFilledHeight: (updater: (prev: number) => number) => void;
}

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
