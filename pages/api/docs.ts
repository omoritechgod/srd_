```typescript
// pages/api/docs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

// Load the Swagger YAML file
const swaggerYamlPath = path.resolve(process.cwd(), 'swagger.js'); // Assuming swagger.js exports the specs object
const swaggerSpec = require(swaggerYamlPath);

// This is a hack to make swagger-ui-express work with Next.js API routes
// It essentially creates a handler that can be used by Next.js
const swaggerHandler = swaggerUi.setup(swaggerSpec);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Serve the Swagger UI
  swaggerUi.serveFiles(swaggerSpec, {})(req, res, () => swaggerHandler(req, res));
}
```