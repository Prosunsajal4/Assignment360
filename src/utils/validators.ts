export const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isStrongPassword = (s: string): boolean => s.length>=8 && /[A-Z]/.test(s) && /[0-9]/.test(s);
