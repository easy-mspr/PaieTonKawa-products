import { config } from 'dotenv';
config({ path: '.env.local' });

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
};