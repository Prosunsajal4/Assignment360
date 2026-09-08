export const getPagination = (page: number, limit: number) => ({ limit: Math.min(limit,100), offset: (Math.max(page,1)-1)*limit });
export const buildMeta = (total: number, page: number, limit: number) => ({ total, page, limit, totalPages: Math.ceil(total/limit) });
export const clampPage = (p: number): number => Math.max(1, p);
