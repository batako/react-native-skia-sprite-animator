import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SpriteAnimator } from 'react-native-skia-sprite-animator';
import type { DataSourceParam } from '@shopify/react-native-skia';
import type { EditorIntegration } from '../hooks/useEditorIntegration';

export interface PreviewPlayerProps {
  integration: EditorIntegration;
  image: DataSourceParam;
  title?: string;
  width?: number;
  height?: number;
}

export const PreviewPlayer = ({
  integration,
  image,
  title = 'Animation Preview',
  width,
  height,
}: PreviewPlayerProps) => {
  const { animatorRef, runtimeData, animationsMeta, speedScale, onFrameChange, onAnimationEnd } =
    integration;
  const { width: imageWidth, height: imageHeight } = useImageDimensions(image);

  let canvasWidth = width ?? imageWidth ?? undefined;
  let canvasHeight = height ?? imageHeight ?? undefined;

  if (canvasWidth && imageWidth && imageHeight && !height) {
    canvasHeight = (imageHeight / imageWidth) * canvasWidth;
  } else if (canvasHeight && imageWidth && imageHeight && !width) {
    canvasWidth = (imageWidth / imageHeight) * canvasHeight;
  }

  if (!canvasWidth) {
    canvasWidth = imageWidth || 320;
  }
  if (!canvasHeight) {
    canvasHeight = imageHeight || 320;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.canvasCard}>
        <View style={[styles.canvasFrame, { width: canvasWidth, height: canvasHeight }]}>
          <SpriteAnimator
            ref={animatorRef}
            image={image}
            data={runtimeData}
            fps={12}
            loop
            animationsMeta={animationsMeta}
            speedScale={speedScale}
            onFrameChange={onFrameChange}
            onAnimationEnd={onAnimationEnd}
            style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
  },
  title: {
    color: '#dfe7ff',
    fontWeight: '600',
    marginBottom: 8,
  },
  canvasCard: {
    backgroundColor: '#0c0f15',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasFrame: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    overflow: 'hidden',
  },
});

const useImageDimensions = (source: DataSourceParam) => {
  const [size, setSize] = React.useState<{ width?: number; height?: number }>({});

  React.useEffect(() => {
    if (typeof source === 'number') {
      const resolved = Image.resolveAssetSource(source);
      if (resolved?.width && resolved?.height) {
        setSize({ width: resolved.width, height: resolved.height });
      }
      return;
    }
    const uri = typeof source === 'string' ? source : (source as { uri?: string }).uri;
    if (!uri) {
      setSize({});
      return;
    }
    let cancelled = false;
    Image.getSize(
      uri,
      (width, height) => {
        if (!cancelled) {
          setSize({ width, height });
        }
      },
      () => {
        if (!cancelled) {
          setSize({});
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [source]);

  return size;
};
