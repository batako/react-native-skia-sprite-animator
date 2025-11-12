import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SpriteAnimator } from 'react-native-skia-sprite-animator';
import type { DataSourceParam } from '@shopify/react-native-skia';
import type { EditorIntegration } from '../hooks/useEditorIntegration';

export interface PlaybackControlsProps {
  integration: EditorIntegration;
  image: DataSourceParam;
}

export const PlaybackControls = ({ integration, image }: PlaybackControlsProps) => {
  const {
    animatorRef,
    runtimeData,
    availableAnimations,
    activeAnimation,
    setActiveAnimation,
    play,
    pause,
    resume,
    stop,
    seekFrame,
    speedScale,
    setSpeedScale,
    isPlaying,
    frameCursor,
    onFrameChange,
    selectedFrameIndex,
  } = integration;

  const handleSelectAnimation = (name: string | null) => {
    setActiveAnimation(name);
    play(name);
  };

  const adjustSpeed = (delta: number) => {
    const next = Math.min(4, Math.max(0.25, Number((speedScale + delta).toFixed(2))));
    setSpeedScale(next);
    if (isPlaying) {
      play(activeAnimation);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Animator Preview</Text>
      <View style={styles.previewCard}>
        <SpriteAnimator
          ref={animatorRef}
          image={image}
          data={runtimeData}
          fps={12}
          loop
          speedScale={speedScale}
          onFrameChange={onFrameChange}
          style={styles.canvas}
        />
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.button}><Button title={isPlaying ? 'Pause' : 'Play'} onPress={() => (isPlaying ? pause() : play(activeAnimation))} /></View>
        <View style={styles.button}><Button title="Resume" onPress={resume} /></View>
        <View style={styles.button}><Button title="Stop" onPress={stop} /></View>
        <View style={styles.button}>
          <Button
            title="Seek Selection"
            onPress={() => selectedFrameIndex !== null && seekFrame(selectedFrameIndex)}
            disabled={selectedFrameIndex === null}
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.button}><Button title="Speed -" onPress={() => adjustSpeed(-0.25)} /></View>
        <View style={styles.button}><Button title="Speed +" onPress={() => adjustSpeed(0.25)} /></View>
        <Text style={styles.speedLabel}>Speed ×{speedScale.toFixed(2)}</Text>
      </View>
      <Text style={styles.subheading}>Animations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.animationsRow}>
        <View style={styles.animationChip}>
          <Button
            title="All Frames"
            color={!activeAnimation ? '#4f8dff' : undefined}
            onPress={() => handleSelectAnimation(null)}
          />
        </View>
        {availableAnimations.map((name) => (
          <View style={styles.animationChip} key={name}>
            <Button
              title={name}
              color={activeAnimation === name ? '#4f8dff' : undefined}
              onPress={() => handleSelectAnimation(name)}
            />
          </View>
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
  button: {
    marginRight: 8,
    marginBottom: 8,
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
    marginRight: 8,
  },
  statusText: {
    marginTop: 12,
    color: '#8a94ab',
    fontSize: 12,
  },
});
