export const slugify = (s: string): string => s.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
export const sanitize = (s: string): string => s.trim().replace(/[<>]/g,'');
export const truncate = (s: string, n: number): string => s.length>n ? s.slice(0,n)+'...' : s;
export const capitalize = (s: string): string => s.charAt(0).toUpperCase()+s.slice(1);
