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

export const DEVICE_HOST = process.env.DEVICE_HOST || '0.0.0.0';
export const GATEWAY_HOST = process.env.GATEWAY_HOST || '0.0.0.0';
export const USER_AUTH_HOST = process.env.USER_AUTH_HOST || '0.0.0.0';

export const GATEWAY_PORT = Number(process.env.GATEWAY_PORT) || 7777;
export const DEVICE_PORT =
  Number(process.env.DEVICE_PORT_8888_TCP_PORT) ||
  Number(process.env.DEVICE_PORT) ||
  8888;
/** Todo: AWS ECS 컨테이너 포트 맵핑 9999 -> 9000 수정 */
export const USER_AUTH_PORT =
  Number(process.env.AUTH_PORT_9000_TCP_PORT) ||
  Number(process.env.USER_AUTH_PORT) ||
  9999;
/** Todo: AWS ECS 컨테이너 맵핑 필요 */
export const requestUrl = `http://${process.env.USER_AUTH_HOST}:${process.env.USER_AUTH_REST_PORT}`;
