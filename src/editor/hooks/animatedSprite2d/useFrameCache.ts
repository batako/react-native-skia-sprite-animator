/* eslint-disable jsdoc/require-jsdoc */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useImage, type DataSourceParam, type SkImage } from '@shopify/react-native-skia';
import type { AnimatedSpriteFrame, FrameImageSource } from '../../animatedSprite2dTypes';

const createCacheKey = (source: FrameImageSource | null | undefined): string | null => {
  if (!source) {
    return null;
  }
  if (source.type === 'uri') {
    return `uri:${source.uri}`;
  }
  if (source.type === 'require') {
    return `require:${source.assetId}`;
  }
  return null;
};

export const useFrameCache = (frame: AnimatedSpriteFrame | null): SkImage | null => {
  const cacheRef = useRef(new Map<string, SkImage>());
  const [cacheVersion, bumpCacheVersion] = useState(0);

  const source = frame?.image ?? null;
  const cacheKey = useMemo(() => createCacheKey(source), [source]);
  const shouldLoad =
    !!cacheKey &&
    source &&
    (source.type === 'uri' || source.type === 'require') &&
    !cacheRef.current.has(cacheKey);

  let dataSource: DataSourceParam | null = null;
  if (shouldLoad && source) {
    dataSource = source.type === 'uri' ? source.uri : source.assetId;
  }

  const loadedImage = useImage(dataSource);

  useEffect(() => {
    if (!cacheKey || !shouldLoad || !loadedImage) {
      return;
    }
    cacheRef.current.set(cacheKey, loadedImage);
    bumpCacheVersion((value) => value + 1);
  }, [cacheKey, loadedImage, shouldLoad]);

  return useMemo<SkImage | null>(() => {
    if (!source) {
      return null;
    }
    if (source.type === 'skImage') {
      return source.image;
    }
    if (!cacheKey) {
      return null;
    }
    void cacheVersion; // invalidate memo when cache updates
    return cacheRef.current.get(cacheKey) ?? null;
  }, [cacheKey, cacheVersion, source]);
};
