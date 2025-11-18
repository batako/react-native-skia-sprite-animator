/* eslint-disable jsdoc/require-jsdoc */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedSprite2D } from '../../AnimatedSprite2D';
import type { SpriteEditorApi } from '../hooks/useSpriteEditor';
import type { EditorIntegration } from '../hooks/useEditorIntegration';
import { buildAnimatedSpriteFrames } from '../utils/buildAnimatedSpriteFrames';

interface AnimatedSprite2DPreviewProps {
  editor: SpriteEditorApi;
  integration: EditorIntegration;
}

export const AnimatedSprite2DPreview = ({ editor, integration }: AnimatedSprite2DPreviewProps) => {
  const resource = useMemo(() => buildAnimatedSpriteFrames(editor.state), [editor.state]);
  const forcedFrame = integration.isPlaying ? null : integration.frameCursor;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AnimatedSprite2D JSON Preview</Text>
      <View style={styles.previewCard}>
        {resource ? (
          <AnimatedSprite2D
            frames={resource}
            animation={integration.activeAnimation}
            playing={integration.isPlaying}
            frame={forcedFrame}
            speedScale={integration.speedScale}
            centered
            style={styles.canvas}
          />
        ) : (
          <Text style={styles.placeholderText}>
            Frame images are missing. AnimatedSprite2D preview becomes available once each frame has
            its own image URI.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    color: '#dfe7ff',
    fontWeight: '600',
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: '#0c0f15',
    borderRadius: 12,
    padding: 16,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1f2430',
  },
  canvas: {
    maxWidth: '100%',
  },
  placeholderText: {
    color: '#9ca9c7',
    textAlign: 'center',
  },
});
