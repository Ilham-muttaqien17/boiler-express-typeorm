import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerWorkspacePaths } from './paths/workspace.path';
import { registerSecurityComponents } from './components/security';
import { registerAuthPaths } from './paths/auth.path';

const registry = new OpenAPIRegistry();

/* Register components */
registerSecurityComponents(registry);

/* Register Paths */
registerAuthPaths(registry);
registerWorkspacePaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDoc = generator.generateDocument({
  info: {
    title: 'API Docs for Boilerplate Express Typeorm',
    version: '1.0.0'
  },
  openapi: '3.0.0',
  servers: [
    {
      description: 'Local Development',
      url: 'http://localhost:3300'
    }
  ]
});
