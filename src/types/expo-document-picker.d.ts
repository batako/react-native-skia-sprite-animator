declare module 'expo-document-picker' {
  /**
   * Asset returned from Expo's document picker.
   */
  export interface DocumentPickerAsset {
    /** File name reported by the picker. */
    name?: string;
    /** File size in bytes when known. */
    size?: number;
    /** Original URI supplied by the OS. */
    uri?: string;
    /** Local cache URI when copyToCacheDirectory is true. */
    fileCopyUri?: string | null;
    /** MIME type reported by the picker. */
    mimeType?: string | null;
  }

  /**
   * Result payload returned after launching the document picker.
   */
  export interface DocumentPickerResult {
    /** True when the user cancels the picker dialog. */
    canceled: boolean;
    /** Selected assets when the dialog completes. */
    assets?: DocumentPickerAsset[];
  }

  /**
   * Options supported by {@link getDocumentAsync}.
   */
  export interface GetDocumentOptions {
    /** MIME filters passed down to the platform picker. */
    type?: string | string[];
    /** When true, copies the result into the cache dir. */
    copyToCacheDirectory?: boolean;
    /** Allows selecting multiple assets when supported. */
    multiple?: boolean;
  }

  /**
   * Opens the document picker UI and resolves with the selection result.
   */
  export function getDocumentAsync(options?: GetDocumentOptions): Promise<DocumentPickerResult>;
}
