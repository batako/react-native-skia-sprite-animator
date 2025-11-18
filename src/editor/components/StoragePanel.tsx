import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { SpriteEditorApi } from '../hooks/useSpriteEditor';
import { useSpriteStorage, type SpriteStorageController } from '../hooks/useSpriteStorage';
import type { SpriteSummary } from '../../storage/spriteStorage';
import { IconButton } from './IconButton';
import { MacWindow } from './MacWindow';
import { getEditorStrings, formatEditorString } from '../localization';

/**
 * Props for the {@link StoragePanel} modal.
 */
interface StoragePanelProps {
  /** Editor instance to read/write sprite data. */
  editor: SpriteEditorApi;
  /** Controls whether the modal is shown. */
  visible: boolean;
  /** Invoked when the modal should close. */
  onClose: () => void;
  /** Callback triggered after saving completes. */
  onSpriteSaved?: (summary: SpriteSummary) => void;
  /** Callback fired when a sprite is loaded. */
  onSpriteLoaded?: (summary: SpriteSummary) => void;
  /** Default status text shown in toolbar. */
  defaultStatusMessage?: string;
  /** Custom storage API injection. */
  storageApi?: SpriteStorageController;
}

/**
 * Modal UI for working with the sprite storage controller.
 */
export const StoragePanel = ({
  editor,
  visible,
  onClose,
  onSpriteSaved,
  onSpriteLoaded,
  defaultStatusMessage,
  storageApi,
}: StoragePanelProps) => {
  const strings = React.useMemo(() => getEditorStrings(), []);
  const [saveName, setSaveName] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [renameDraft, setRenameDraft] = React.useState('');
  const {
    sprites,
    status,
    isBusy,
    refresh,
    saveSpriteAs,
    loadSpriteById,
    renameSprite,
    deleteSpriteById,
  } = useSpriteStorage({
    editor,
    controller: storageApi,
    onSpriteLoaded,
    onSpriteSaved,
  });

  React.useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [refresh, visible]);

  const handleSave = async () => {
    const summary = await saveSpriteAs(saveName);
    if (summary) {
      setSaveName('');
      onClose();
    }
  };

  const handleLoad = async (id: string) => {
    await loadSpriteById(id);
  };

  const handleDelete = async (id: string, name: string) => {
    if (isBusy) {
      return;
    }
    Alert.alert(
      strings.storagePanel.deleteSpriteTitle,
      formatEditorString(strings.storagePanel.deleteSpriteMessage, { name }),
      [
        { text: strings.general.cancel, style: 'cancel' },
        {
          text: strings.general.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteSpriteById(id, name);
          },
        },
      ],
    );
  };

  const handleRename = async (id: string, nextName: string) => {
    const trimmed = nextName.trim();
    if (!trimmed) {
      setEditingId(null);
      setRenameDraft('');
      return;
    }
    const existing = sprites.find((sprite) => sprite.id === id);
    if (existing && existing.displayName === trimmed) {
      setEditingId(null);
      setRenameDraft('');
      return;
    }
    const result = await renameSprite(id, trimmed);
    if (result) {
      onClose();
    }
    setEditingId(null);
    setRenameDraft('');
  };

  const localizeStatus = React.useCallback(
    (message: string | null) => {
      if (!message) {
        return null;
      }
      if (message === 'Add at least one frame before saving.') {
        return strings.storagePanel.statusNeedFrames;
      }
      if (message === 'Sprite not found on disk.') {
        return strings.storagePanel.statusMissing;
      }
      if (message === 'Name cannot be empty.') {
        return strings.storagePanel.statusNameRequired;
      }
      const match = message.match(
        /^(Saved sprite|Loaded sprite|Overwrote sprite|Renamed sprite to|Deleted sprite) (.+)\.$/,
      );
      if (match) {
        const [, key, rawName] = match;
        const name = rawName.trim();
        if (key === 'Saved sprite') {
          return formatEditorString(strings.storagePanel.statusSaved, { name });
        }
        if (key === 'Loaded sprite') {
          return formatEditorString(strings.storagePanel.statusLoaded, { name });
        }
        if (key === 'Overwrote sprite') {
          return formatEditorString(strings.storagePanel.statusOverwritten, { name });
        }
        if (key === 'Renamed sprite to') {
          return formatEditorString(strings.storagePanel.statusRenamed, { name });
        }
        if (key === 'Deleted sprite') {
          return formatEditorString(strings.storagePanel.statusDeleted, { name });
        }
      }
      return message;
    },
    [
      strings.storagePanel.statusDeleted,
      strings.storagePanel.statusLoaded,
      strings.storagePanel.statusMissing,
      strings.storagePanel.statusNameRequired,
      strings.storagePanel.statusNeedFrames,
      strings.storagePanel.statusOverwritten,
      strings.storagePanel.statusRenamed,
      strings.storagePanel.statusSaved,
    ],
  );
  const translatedStatus = React.useMemo(() => localizeStatus(status), [localizeStatus, status]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <MacWindow
          title={strings.storagePanel.title}
          onClose={onClose}
          contentStyle={styles.windowContent}
          toolbarContent={
            <View style={styles.toolbarContent}>
              <Text style={styles.toolbarStatus}>
                {translatedStatus ?? defaultStatusMessage ?? strings.storagePanel.defaultStatus}
              </Text>
            </View>
          }
          enableCompact={false}
        >
          <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.meta}>{strings.storagePanel.spriteNameLabel}</Text>
              <TextInput
                style={styles.nameInput}
                value={saveName}
                onChangeText={setSaveName}
                placeholder={strings.storagePanel.spriteNamePlaceholder}
                editable={!isBusy}
              />
            </View>
            <View style={styles.formActions}>
              <IconButton
                iconFamily="material"
                name="save"
                onPress={handleSave}
                disabled={isBusy}
                accessibilityLabel={strings.storagePanel.saveSprite}
              />
            </View>
          </View>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {sprites.map((sprite) => (
              <View key={sprite.id} style={styles.spriteRow}>
                <View style={{ flex: 1 }}>
                  {editingId === sprite.id ? (
                    <TextInput
                      style={styles.renameInput}
                      value={renameDraft}
                      onChangeText={setRenameDraft}
                      autoFocus
                      onSubmitEditing={() => handleRename(sprite.id, renameDraft)}
                      onBlur={() => handleRename(sprite.id, renameDraft)}
                      editable={!isBusy}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.renameDisplay}
                      onPress={() => {
                        setEditingId(sprite.id);
                        setRenameDraft(sprite.displayName);
                      }}
                      disabled={isBusy}
                    >
                      <Text style={styles.spriteName}>{sprite.displayName}</Text>
                      <Text style={styles.spriteMeta}>
                        {strings.storagePanel.updatedPrefix}{' '}
                        {new Date(sprite.updatedAt).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.rowButtons}>
                  <IconButton
                    iconFamily="material"
                    name="file-upload"
                    onPress={() => handleLoad(sprite.id)}
                    disabled={isBusy}
                    accessibilityLabel={strings.storagePanel.loadSprite}
                  />
                  <IconButton
                    iconFamily="material"
                    name="delete"
                    onPress={() => handleDelete(sprite.id, sprite.displayName)}
                    disabled={isBusy}
                    accessibilityLabel={strings.storagePanel.deleteSprite}
                  />
                </View>
              </View>
            ))}
            {!sprites.length && <Text style={styles.empty}>{strings.storagePanel.emptyList}</Text>}
          </ScrollView>
        </MacWindow>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 10, 18, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  windowContent: {
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 12,
  },
  toolbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  toolbarStatus: {
    color: '#d9def7',
    fontSize: 13,
  },
  toolbarSpacer: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 6,
  },
  nameInput: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#303852',
    backgroundColor: '#1a1f2d',
    color: '#f6f8ff',
    marginBottom: 4,
  },
  meta: {
    marginTop: 6,
    marginBottom: 6,
    color: '#9ea4bc',
    fontSize: 12,
  },
  list: {
    marginTop: 6,
    maxHeight: 360,
  },
  listContent: {
    paddingBottom: 12,
  },
  spriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#202837',
  },
  spriteName: {
    color: '#dfe5ff',
    fontWeight: '500',
  },
  spriteMeta: {
    color: '#929abd',
    fontSize: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  renameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#39405c',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#f0f4ff',
    height: 34,
  },
  renameDisplay: {
    height: 34,
    justifyContent: 'center',
  },
  empty: {
    color: '#606984',
  },
});
