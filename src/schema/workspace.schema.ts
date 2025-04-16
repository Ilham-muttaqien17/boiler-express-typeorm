import type { TWorkspace } from '@src/types/workspace';
import z from 'zod';

export const workspaceSchema = z.object<Record<keyof TWorkspace, any>>({
  name: z.string().trim().min(1, 'Name is required')
});
