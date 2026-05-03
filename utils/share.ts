/**
 * Sharing Utilities
 * Provides a unified interface for web sharing and clipboard fallbacks.
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

/**
 * Executes a native share if available, otherwise falls back to clipboard.
 * Returns true if native share was successful, false otherwise.
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(options);
      return true;
    } catch (err) {
      console.warn('[Share] Native share failed or cancelled:', err);
      return copyToClipboard(options.text || options.url || '');
    }
  } else {
    return copyToClipboard(options.text || options.url || '');
  }
}

/**
 * Copies text to the clipboard with high reliability.
 */
export function copyToClipboard(text: string): boolean {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}
