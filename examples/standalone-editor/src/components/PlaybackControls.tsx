import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import {
  AnimatedSprite2D,
  type SpriteData,
  type SpriteFramesResource,
  type FrameImageSource,
  type FrameImageSubset,
} from 'react-native-skia-sprite-animator';
import type { DataSourceParam, SkImage } from '@shopify/react-native-skia';
import type { EditorIntegration } from '../hooks/useEditorIntegration';
import { IconButton } from './IconButton';

/**
 * Props for the {@link PlaybackControls} component.
 */
export interface PlaybackControlsProps {
  /** Combined editor + animator integration helpers. */
  integration: EditorIntegration;
  /** Sprite sheet image fed into AnimatedSprite2D. */
  image: DataSourceParam;
}

/**
 * Renders preview playback controls around {@link AnimatedSprite2D}.
 */
export const PlaybackControls = ({ integration, image }: PlaybackControlsProps) => {
  const {
    runtimeData,
    availableAnimations,
    activeAnimation,
    setActiveAnimation,
    playForward,
    pause,
    stop,
    seekFrame,
    speedScale,
    setSpeedScale,
    isPlaying,
    frameCursor,
    onAnimationEnd,
    selectedFrameIndex,
  } = integration;

  const toFrameImage = (source: DataSourceParam | undefined, subset?: FrameImageSubset | null) => {
    if (!source) {
      return null;
    }
    if (typeof source === 'number') {
      return subset
        ? ({ type: 'require', assetId: source, subset } as FrameImageSource)
        : ({ type: 'require', assetId: source } as FrameImageSource);
    }
    if (typeof source === 'string') {
      return subset
        ? ({ type: 'uri', uri: source, subset } as FrameImageSource)
        : ({ type: 'uri', uri: source } as FrameImageSource);
    }
    return subset
      ? ({ type: 'skImage', image: source as unknown as SkImage, subset } as FrameImageSource)
      : ({ type: 'skImage', image: source as unknown as SkImage } as FrameImageSource);
  };

  const buildResource = React.useMemo((): SpriteFramesResource | null => {
    const frames: SpriteFramesResource['frames'] = [];
    for (let i = 0; i < runtimeData.frames.length; i += 1) {
      const frame = runtimeData.frames[i] as SpriteData['frames'][number];
      const subset =
        typeof frame.x === 'number' && typeof frame.y === 'number'
          ? ({ x: frame.x, y: frame.y, width: frame.w, height: frame.h } as FrameImageSubset)
          : undefined;
      const imageSource: FrameImageSource | null =
        (frame.imageUri
          ? subset
            ? ({ type: 'uri', uri: frame.imageUri, subset } as FrameImageSource)
            : ({ type: 'uri', uri: frame.imageUri } as FrameImageSource)
          : null) ?? toFrameImage(image, subset);
      if (!imageSource) {
        return null;
      }
      frames.push({
        id: `frame-${i}`,
        width: frame.w,
        height: frame.h,
        duration: frame.duration,
        image: imageSource,
      });
    }
    return {
      frames,
      animations: runtimeData.animations ?? {},
      animationsMeta: runtimeData.animationsMeta,
      autoPlayAnimation: runtimeData.autoPlayAnimation ?? null,
      meta: runtimeData.meta ?? {},
    };
  }, [
    image,
    runtimeData.animations,
    runtimeData.animationsMeta,
    runtimeData.autoPlayAnimation,
    runtimeData.frames,
    runtimeData.meta,
  ]);

  const handleSelectAnimation = (name: string | null) => {
    setActiveAnimation(name);
    playForward(name);
  };

  const adjustSpeed = (delta: number) => {
    const next = Math.min(4, Math.max(0.25, Number((speedScale + delta).toFixed(2))));
    setSpeedScale(next);
    if (isPlaying) {
      playForward(activeAnimation);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Animator Preview</Text>
      <View style={styles.previewCard}>
        {buildResource ? (
          <AnimatedSprite2D
            frames={buildResource}
            animation={activeAnimation}
            playing={isPlaying}
            frame={frameCursor}
            speedScale={speedScale}
            onAnimationFinished={onAnimationEnd}
            style={styles.canvas}
          />
        ) : (
          <Text style={styles.statusText}>画像を読み込めませんでした</Text>
        )}
      </View>
      <View style={styles.buttonRow}>
        <IconButton
          iconFamily="material"
          name={isPlaying ? 'pause' : 'play-arrow'}
          onPress={() => (isPlaying ? pause() : playForward(activeAnimation))}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        />
        <IconButton iconFamily="material" name="stop" onPress={stop} accessibilityLabel="Stop" />
        <IconButton
          name="gps-fixed"
          onPress={() => selectedFrameIndex !== null && seekFrame(selectedFrameIndex)}
          disabled={selectedFrameIndex === null}
          accessibilityLabel="Seek selected frame"
        />
      </View>
      <View style={styles.buttonRow}>
        <IconButton
          name="remove"
          onPress={() => adjustSpeed(-0.25)}
          accessibilityLabel="Slow down"
        />
        <IconButton name="add" onPress={() => adjustSpeed(0.25)} accessibilityLabel="Speed up" />
        <Text style={styles.speedLabel}>Speed ×{speedScale.toFixed(2)}</Text>
      </View>
      <Text style={styles.subheading}>Animations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.animationsRow}>
        <Pressable
          style={[styles.animationChip, !activeAnimation && styles.animationChipActive]}
          onPress={() => handleSelectAnimation(null)}
        >
          <Text style={styles.animationChipText}>All Frames</Text>
        </Pressable>
        {availableAnimations.map((name) => (
          <Pressable
            key={name}
            style={[styles.animationChip, activeAnimation === name && styles.animationChipActive]}
            onPress={() => handleSelectAnimation(name)}
          >
            <Text style={styles.animationChipText}>{name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.statusText}>
        Frame cursor: {frameCursor} / {runtimeData.frames.length - 1}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#151922',
    borderWidth: 1,
    borderColor: '#1f2430',
  },
  heading: {
    color: '#dfe7ff',
    fontWeight: '600',
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: '#0c0f15',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: 200,
    height: 200,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  speedLabel: {
    color: '#a5b0c5',
    alignSelf: 'center',
  },
  subheading: {
    color: '#a5b0c5',
    marginTop: 12,
    marginBottom: 4,
  },
  animationsRow: {
    flexGrow: 0,
  },
  animationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a3142',
  },
  animationChipActive: {
    backgroundColor: '#4f8dff33',
    borderColor: '#4f8dff',
  },
  animationChipText: {
    color: '#e5ecff',
    fontSize: 12,
  },
  statusText: {
    marginTop: 12,
    color: '#8a94ab',
    fontSize: 12,
  },
});
