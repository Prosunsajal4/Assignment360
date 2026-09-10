export const logger = { info: (m: string, d?: unknown) => console.log('[INFO] '+m, d ?? ''), error: (m: string, e?: unknown) => console.error('[ERROR] '+m, e ?? ''), warn: (m: string, d?: unknown) => console.warn('[WARN] '+m, d ?? '') };
export const debug = (m: string, d?: unknown) => console.debug('[DEBUG] '+m, d ?? '');
