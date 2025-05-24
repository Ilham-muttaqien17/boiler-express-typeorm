import { type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { paginationQuerySchema, paginationResultSchema } from '@src/schema/pagination.schema';
import { workspaceSchema } from '@src/schema/workspace.schema';
import z from 'zod';
import { openAPIDefaultResponse } from '../default_response';
import { omit } from '@src/utils/helpers';

export const registerWorkspacePaths = (registry: OpenAPIRegistry) => {
  registry.register('Workspace', workspaceSchema);

  /* Workspace specs */
  registry.registerPath({
    summary: 'Get list of workspaces',
    method: 'get',
    path: '/api/workspaces',
    tags: ['Workspace'],
    request: {
      query: paginationQuerySchema
    },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'List of Workspaces',
        content: {
          'application/json': {
            schema: paginationResultSchema
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['400', '404', '422'])
    }
  });

  registry.registerPath({
    summary: 'Create Workspace',
    method: 'post',
    path: '/api/workspaces',
    tags: ['Workspace'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: workspaceSchema
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    responses: {
      201: {
        description: 'Create Workspace Success',
        content: {
          'application/json': {
            example: {
              message: 'Workspace created successfully',
              result: {
                id: 3,
                name: 'string',
                created_at: '2025-05-23T09:10:56.190Z',
                updated_at: '2025-05-23T09:10:56.190Z'
              }
            },
            schema: {}
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['404'])
    }
  });

  registry.registerPath({
    summary: 'Get Detail Workspace',
    method: 'get',
    path: '/api/workspaces/{id}',
    tags: ['Workspace'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '' })
      })
    },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Detail of Workspace',
        content: {
          'application/json': {
            example: {
              result: {
                id: 1,
                name: 'string',
                created_at: '2025-05-23T07:48:35.030Z',
                updated_at: '2025-05-23T07:48:35.030Z'
              }
            },
            schema: {}
          }
        }
      },
      ...openAPIDefaultResponse
    }
  });

  registry.registerPath({
    summary: 'Update Workspace',
    method: 'put',
    path: '/api/workspaces/{id}',
    tags: ['Workspace'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '' })
      }),
      body: {
        content: {
          'application/json': {
            schema: workspaceSchema
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Update Workspace Success',
        content: {
          'application/json': {
            example: {
              message: 'Workspace updated successfully'
            },
            schema: {}
          }
        }
      },
      ...openAPIDefaultResponse
    }
  });

  registry.registerPath({
    summary: 'Delete Workspaces',
    method: 'delete',
    path: '/api/workspaces/{id}',
    tags: ['Workspace'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '' })
      })
    },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Delete Workspace Success',
        content: {
          'application/json': {
            example: {
              message: 'Workspace deleted successfully'
            },
            schema: {}
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['400', '422'])
    }
  });
};
