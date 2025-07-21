// pages/api/docs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger';

// This handler serves the Swagger UI
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Set up Swagger UI
    const swaggerUiAssetHandler = swaggerUi.serveFiles(swaggerSpec, {});
    const swaggerUiIndexTemplate = swaggerUi.generateHTML(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'SRD Consulting Ltd API Documentation'
    });

    // Serve Swagger UI assets or the main page
    if (req.url?.includes('.css') || req.url?.includes('.js') || req.url?.includes('.png')) {
      return swaggerUiAssetHandler(req, res, () => {
        res.status(404).end();
      });
    }

    // Serve the main Swagger UI page
    res.setHeader('Content-Type', 'text/html');
    res.send(swaggerUiIndexTemplate);
  } catch (error) {
    console.error('Error serving Swagger docs:', error);
    res.status(500).json({ 
      message: 'Error loading API documentation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}