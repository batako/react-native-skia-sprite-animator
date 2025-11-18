/* eslint-disable jsdoc/require-jsdoc */
import type { ImageSourcePropType } from 'react-native';

export const SPRITE_SHEET_META_KEY = '__spriteSheetSource';

export type SpriteSheetMeta = {
  kind: 'uri' | 'asset';
  uri?: string;
  assetId?: number;
  width: number;
  height: number;
};

export type SpriteSheetSourceInfo = {
  imageSource: ImageSourcePropType;
  width: number;
  height: number;
};

export const buildSpriteSheetMeta = (
  source: ImageSourcePropType,
  width: number,
  height: number,
): SpriteSheetMeta | null => {
  if (typeof source === 'number') {
    return { kind: 'asset', assetId: source, width, height };
  }
  if (Array.isArray(source)) {
    return null;
  }
  if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
    return { kind: 'uri', uri: source.uri, width, height };
  }
  return null;
};

export const spriteSheetMetaEquals = (
  a?: SpriteSheetMeta | null,
  b?: SpriteSheetMeta | null,
): boolean => {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return (
    a.kind === b.kind &&
    a.uri === b.uri &&
    a.assetId === b.assetId &&
    a.width === b.width &&
    a.height === b.height
  );
};

export const spriteSheetMetaToSource = (
  meta?: SpriteSheetMeta | null,
): ImageSourcePropType | null => {
  if (!meta) {
    return null;
  }
  if (meta.kind === 'asset' && typeof meta.assetId === 'number') {
    return meta.assetId;
  }
  if (meta.kind === 'uri' && typeof meta.uri === 'string') {
    return { uri: meta.uri };
  }
  return null;
};
