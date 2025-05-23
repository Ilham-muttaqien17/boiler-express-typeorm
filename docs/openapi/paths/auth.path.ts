import { type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { loginSchema, registerUserSchema } from '@src/schema/auth.schema';
import z from 'zod';
import { openAPIDefaultResponse } from '../default_response';
import { omit } from '@src/utils/helpers';

export const registerAuthPaths = (registry: OpenAPIRegistry) => {
  registry.register('Sign In', loginSchema);
  registry.register('Sign Up', registerUserSchema);

  /* Auth specs */
  registry.registerPath({
    summary: 'Sign In',
    method: 'post',
    path: '/api/login',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sign In Success Reponse',
        content: {
          'application/json': {
            schema: z.object({})
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['404'])
    }
  });

  registry.registerPath({
    summary: 'Sign Up',
    method: 'post',
    path: '/api/secret-registration',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerUserSchema
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Sign Up Success Response',
        content: {
          'application/json': {
            schema: z.object({})
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['404'])
    }
  });

  registry.registerPath({
    summary: 'Sign Out',
    method: 'delete',
    path: '/api/logout',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Sign Out Success Response',
        content: {
          'application/json': {
            example: {
              message: 'Logout success'
            },
            schema: {}
          }
        }
      },
      ...omit(openAPIDefaultResponse, ['400', '404', '422'])
    }
  });
};
