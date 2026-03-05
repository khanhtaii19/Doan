export const JWT_SECRET: string = process.env.JWT_SECRET as string;
export const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';
export const ADMIN_EMAIL: string = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
