import path from 'path';
export const getExt = (f: string): string => path.extname(f).toLowerCase();
export const isAllowedImage = (f: string): boolean => ['.jpg','.jpeg','.png','.webp'].includes(getExt(f));
