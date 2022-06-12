import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === 'production'
      ? '../../env/.env.production'
      : process.env.NODE_ENV === 'test'
      ? '../../env/.env.test'
      : process.env.NODE_ENV === 'development'
      ? '../../env/.env.development'
      : '../../env/.env',
  ),
});

export const device_host = process.env.DEVICE_HOST || '0.0.0.0';
export const gateway_host = process.env.GATEWAY_HOST || '0.0.0.0';
export const device_port = Number(process.env.DEVICE_PORT) || 7779;
export const rest_gateway_port = Number(process.env.GATEWAY_PORT) || 7777;
export const event_gateway_port =
  Number(process.env.EVENT_GATEWAY_PORT) || 7776;
