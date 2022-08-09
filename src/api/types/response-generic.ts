import { Response } from 'express';

export type ResponseGeneric<T> = Response<T, Record<string, T>>;
