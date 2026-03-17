import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET as string;
export const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';
export const ADMIN_EMAIL: string = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || '';
