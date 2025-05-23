import type { TWorkspace } from '@src/types/workspace';
import z from 'zod';

export const workspaceSchema = z.object<Record<keyof TWorkspace, any>>({
  name: z.string({ required_error: 'Name is required' }).trim().min(1, 'Name is required')
});
