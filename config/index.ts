import dotenv from 'dotenv';
dotenv.config();

export const hotwalletname = process.env.HOT_WALLET_NAME || 'hotwallet';
export const coldwalletname = process.env.COLD_WALLET_NAME || 'coldwallet';