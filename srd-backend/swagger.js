// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SRD Consulting Ltd API',
      version: '1.0.0',
      description: 'API documentation for the SRD Consulting Ltd website backend.',
      contact: {
        name: 'SRD Consulting Ltd',
        email: 'info@adminsrd.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
      // Add production server URL here when deployed
      // {
      //   url: 'https://your-deployed-backend.render.com/api',
      //   description: 'Production server',
      // },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login'
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            org: { type: 'string', nullable: true },
            rating: { type: 'integer', nullable: true, minimum: 1, maximum: 5 },
            text: { type: 'string' },
            photo: { type: 'string', nullable: true },
            approved: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            service: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            notes: { type: 'string', nullable: true },
            file: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        About: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            image: { type: 'string', nullable: true },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string', nullable: true }
          }
        }
      },
    },
  },
  apis: ['./pages/api/**/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;