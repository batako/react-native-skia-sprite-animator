import { useCallback, useEffect, useState } from 'react';
import {
  deleteSprite as defaultDeleteSprite,
  listSprites as defaultListSprites,
  loadSprite as defaultLoadSprite,
  saveSprite as defaultSaveSprite,
  type SpriteEditorApi,
  type SpriteSummary,
  type StoredSprite,
} from 'react-native-skia-sprite-animator';

export interface SpriteStorageController {
  listSprites: () => Promise<SpriteSummary[]>;
  loadSprite: (id: string) => Promise<StoredSprite | null>;
  saveSprite: typeof defaultSaveSprite;
  deleteSprite: (id: string) => Promise<void>;
}

export interface UseSpriteStorageOptions {
  editor: SpriteEditorApi;
  controller?: SpriteStorageController;
  onSpriteSaved?: (summary: SpriteSummary) => void;
  onSpriteLoaded?: (summary: SpriteSummary) => void;
}

interface UseSpriteStorageResult {
  sprites: SpriteSummary[];
  status: string | null;
  isBusy: boolean;
  refresh: () => Promise<void>;
  saveSpriteAs: (name: string) => Promise<SpriteSummary | null>;
  loadSpriteById: (id: string) => Promise<SpriteSummary | null>;
  overwriteSprite: (id: string, displayName: string) => Promise<SpriteSummary | null>;
  renameSprite: (id: string, name: string) => Promise<SpriteSummary | null>;
  deleteSpriteById: (id: string, displayName: string) => Promise<boolean>;
}

const toSummary = (stored: StoredSprite): SpriteSummary => ({
  id: stored.id,
  displayName: stored.meta.displayName,
  createdAt: stored.meta.createdAt,
  updatedAt: stored.meta.updatedAt,
});

const defaultController: SpriteStorageController = {
  listSprites: defaultListSprites,
  loadSprite: defaultLoadSprite,
  saveSprite: defaultSaveSprite,
  deleteSprite: defaultDeleteSprite,
};

export const useSpriteStorage = ({
  editor,
  controller,
  onSpriteLoaded,
  onSpriteSaved,
}: UseSpriteStorageOptions): UseSpriteStorageResult => {
  const storage = controller ?? defaultController;
  const [sprites, setSprites] = useState<SpriteSummary[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const items = await storage.listSprites();
      setSprites(items);
    } catch (error) {
      setStatus((error as Error).message);
    }
  }, [storage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSpriteAs = useCallback(
    async (name: string) => {
      if (!editor.state.frames.length) {
        setStatus('Add at least one frame before saving.');
        return null;
      }
      const trimmedName = name.trim() || 'Untitled Sprite';
      setIsBusy(true);
      try {
        const payload = editor.exportJSON();
        const now = Date.now();
        const stored = await storage.saveSprite({
          sprite: {
            ...payload,
            meta: {
              ...(payload.meta ?? {}),
              displayName: trimmedName,
              createdAt: payload.meta?.createdAt ?? now,
              updatedAt: now,
            },
          },
        });
        editor.updateMeta({ displayName: trimmedName });
        const summary = toSummary(stored);
        setStatus(`Saved sprite ${trimmedName}.`);
        onSpriteSaved?.(summary);
        await refresh();
        return summary;
      } catch (error) {
        setStatus((error as Error).message);
        return null;
      } finally {
        setIsBusy(false);
      }
    },
    [editor, onSpriteSaved, refresh, storage],
  );

  const loadSpriteById = useCallback(
    async (id: string) => {
      setIsBusy(true);
      try {
        const stored = await storage.loadSprite(id);
        if (!stored) {
          setStatus('Sprite not found on disk.');
          return null;
        }
        editor.importJSON(stored);
        const summary = toSummary(stored);
        setStatus(`Loaded sprite ${stored.meta.displayName}.`);
        onSpriteLoaded?.(summary);
        return summary;
      } catch (error) {
        setStatus((error as Error).message);
        return null;
      } finally {
        setIsBusy(false);
      }
    },
    [editor, onSpriteLoaded, storage],
  );

  const overwriteSprite = useCallback(
    async (id: string, displayName: string) => {
      if (!editor.state.frames.length) {
        setStatus('Add at least one frame before saving.');
        return null;
      }
      setIsBusy(true);
      try {
        const payload = editor.exportJSON();
        const stored = await storage.loadSprite(id);
        if (!stored) {
          setStatus('Sprite not found on disk.');
          return null;
        }
        const now = Date.now();
        const result = await storage.saveSprite({
          sprite: {
            ...payload,
            id,
            meta: {
              ...(payload.meta ?? {}),
              displayName,
              createdAt: stored.meta.createdAt ?? now,
              updatedAt: now,
            },
          },
        });
        const summary = toSummary(result);
        setStatus(`Overwrote sprite ${displayName}.`);
        onSpriteSaved?.(summary);
        await refresh();
        return summary;
      } catch (error) {
        setStatus((error as Error).message);
        return null;
      } finally {
        setIsBusy(false);
      }
    },
    [editor, onSpriteSaved, refresh, storage],
  );

  const renameSprite = useCallback(
    async (id: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) {
        setStatus('Name cannot be empty.');
        return null;
      }
      setIsBusy(true);
      try {
        const stored = await storage.loadSprite(id);
        if (!stored) {
          setStatus('Sprite not found on disk.');
          return null;
        }
        const result = await storage.saveSprite({
          sprite: {
            id: stored.id,
            frames: stored.frames,
            animations: stored.animations,
            animationsMeta: stored.animationsMeta,
            meta: { ...stored.meta, displayName: trimmed, updatedAt: Date.now() },
          },
        });
        const summary = toSummary(result);
        setStatus(`Renamed sprite to ${trimmed}.`);
        onSpriteSaved?.(summary);
        await refresh();
        return summary;
      } catch (error) {
        setStatus((error as Error).message);
        return null;
      } finally {
        setIsBusy(false);
      }
    },
    [onSpriteSaved, refresh, storage],
  );

  const deleteSpriteById = useCallback(
    async (id: string, displayName: string) => {
      setIsBusy(true);
      try {
        await storage.deleteSprite(id);
        await refresh();
        setStatus(`Sprite ${displayName} removed from storage.`);
        return true;
      } catch (error) {
        setStatus((error as Error).message);
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [refresh, storage],
  );

  return {
    sprites,
    status,
    isBusy,
    refresh,
    saveSpriteAs,
    loadSpriteById,
    overwriteSprite,
    renameSprite,
    deleteSpriteById,
  };
};
