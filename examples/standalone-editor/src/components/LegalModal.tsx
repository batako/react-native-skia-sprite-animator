/* eslint-disable jsdoc/require-jsdoc */
import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton } from './IconButton';

interface LegalModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const LegalModal = ({ title, visible, onClose, children }: LegalModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <IconButton name="close" onPress={onClose} accessibilityLabel="Close" />
        </View>
        <ScrollView style={styles.body}>{children}</ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});
