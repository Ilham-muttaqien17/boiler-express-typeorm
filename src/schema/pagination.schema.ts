import z from 'zod';

export const paginationSchema = z.object({
  limit: z.string().openapi({ example: '10' }).optional(),
  page: z.string().openapi({ example: '1' }).optional(),
  col: z.string().openapi({ example: 'created_at' }).optional(),
  direction: z.enum(['ASC', 'DESC']).openapi({ example: 'ASC' }).optional(),
  search: z.string().openapi({ example: '' }).optional()
});
