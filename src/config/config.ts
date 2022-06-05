import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../env/.env.${process.env.NODE_ENV}`),
});

export const DEVICE_HOST = process.env.DEVICE_HOST || '0.0.0.0';
export const API_GATEWAY_HOST = process.env.GATEWAY_HOST || '0.0.0.0';
export const USER_AUTH_HOST = process.env.USER_AUTH_HOST || '0.0.0.0';
export const USER_AUTH_PORT = Number(process.env.USER_AUTH_PORT) || 9999;
export const DEVICE_PORT = Number(process.env.DEVICE_PORT) || 7779;
export const REST_GATEWAY_PORT = Number(process.env.GATEWAY_PORT) || 7777;
export const EVENT_GATEWAY_PORT =
  Number(process.env.EVENT_GATEWAY_PORT) || 7776;
