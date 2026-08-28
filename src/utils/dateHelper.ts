export const formatDate = (d: Date): string => d.toISOString().split('T')[0];
export const diffDays = (a: Date, b: Date): number => Math.ceil(Math.abs(a.getTime()-b.getTime())/86400000);
export const addDays = (d: Date, n: number): Date => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
