import swaggerJsdoc from 'swagger-jsdoc';
import { BASE_API_URL } from '@/utils/constants/api';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'Full API documentation for Portfolio project',
    },
    servers: [
      {
        url: BASE_API_URL,
      },
    ],
    components: {
      schemas: {
        ExperienceBlock: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            companyName: { type: 'string' },
            iconPath: { type: 'string' },
            alt: { type: 'string' },
            location: { type: 'string' },
          },
        },
        ExperiencePeriod: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            position: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date', nullable: true },
            experienceBlockId: { type: 'integer' },
          },
        },
        WorkItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            img: { type: 'string' },
            menuId: { type: 'integer' },
          },
        },
        WorkItemLink: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            url: { type: 'string' },
            label: { type: 'string', nullable: true },
            imgPath: { type: 'string', nullable: true },
            workItemId: { type: 'integer' },
          },
        },
        SocialLink: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            url: { type: 'string' },
            imgPath: { type: 'string' },
            alt: { type: 'string' },
          },
        },
        Technology: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            iconPath: { type: 'string' },
          },
        },
        Menu: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            link: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'], // scan your route files for JSDoc
});
