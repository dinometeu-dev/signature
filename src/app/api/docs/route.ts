import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';
import swaggerUi from 'swagger-ui-express';

export async function GET() {
  const html = swaggerUi.generateHTML(swaggerSpec);
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
