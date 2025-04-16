import type { TStore } from '@src/types/store';
import z from 'zod';

export const storeSchema = z.object<Record<keyof TStore, any>>({
  name: z.string().trim().min(1, 'Name is required')
});
