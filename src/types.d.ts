import type { VALID_MIMETYPES } from './constants';

export type Nullable<T> = T | null;

export type AnyType = any;

export type MIME_TYPE = (typeof VALID_MIMETYPES)[number];
