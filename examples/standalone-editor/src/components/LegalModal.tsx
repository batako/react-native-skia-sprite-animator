/* eslint-disable jsdoc/require-jsdoc */
import React from 'react';
import {
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { IconButton } from './IconButton';

interface LegalModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ANIMATION_DURATION_MS = 280;

export const LegalModal = ({ title, visible, onClose, children }: LegalModalProps) => {
  const { width } = useWindowDimensions();
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== 'light';
  const styles = React.useMemo(() => createThemedStyles(isDarkMode), [isDarkMode]);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  React.useEffect(() => {
    if (!shouldRender) {
      return;
    }
    slideAnim.stopAnimation();
    if (visible) {
      slideAnim.setValue(width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: ANIMATION_DURATION_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [visible, width, shouldRender, slideAnim]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal visible={shouldRender} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.slideWrapper, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <IconButton name="close" onPress={onClose} accessibilityLabel="Close" />
            </View>
            <ScrollView style={styles.body}>{children}</ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const COLOR_PROP_KEYS = new Set([
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderEndColor',
  'borderTopColor',
  'color',
  'shadowColor',
]);

const lightColorMap: Record<string, string> = {
  '#080b12': '#f7f9fd',
  '#1f2430': '#d9dfe9',
  '#f5f6ff': '#0f172a',
};

const lightTextColorMap: Record<string, string> = {
  '#f5f6ff': '#0f172a',
};

const mapStyleColors = (
  stylesObject: Record<string, any>,
  mapColor: (value: string, key: string) => string,
): Record<string, any> => {
  const next: Record<string, any> = {};
  Object.entries(stylesObject).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      next[key] = mapStyleColors(value, mapColor);
      return;
    }
    if (typeof value === 'string' && COLOR_PROP_KEYS.has(key)) {
      next[key] = mapColor(value, key);
      return;
    }
    next[key] = value;
  });
  return next;
};

const baseStyles = {
  modalRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  slideWrapper: {
    flex: 1,
    backgroundColor: '#080b12',
  },
  container: {
    flex: 1,
    backgroundColor: '#080b12',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2430',
  },
  title: {
    color: '#f5f6ff',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
};

const createThemedStyles = (isDarkMode: boolean) => {
  const mapColor = (value: string, key: string) => {
    if (isDarkMode) {
      return value;
    }
    if (key === 'color') {
      return lightTextColorMap[value] ?? lightColorMap[value] ?? value;
    }
    return lightColorMap[value] ?? value;
  };
  return StyleSheet.create(mapStyleColors(baseStyles, mapColor));
};
