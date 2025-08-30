import { PrismaClient } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      include: {
        workItem: true,
      },
    });
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch links ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, label, imgPath, workItemId } = body;

    if (!url || !workItemId) {
      return NextResponse.json(
        { error: 'URL and workItemId are required' },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        url,
        label,
        imgPath,
        workItemId,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create link ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, url, label, imgPath, workItemId } = body;

    if (!id || (!url && !label && !imgPath && !workItemId)) {
      return NextResponse.json(
        { error: 'Invalid update data' },
        { status: 400 }
      );
    }

    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    const link = await prisma.link.update({
      where: { id: numericId },
      data: {
        ...(url && { url }),
        ...(label && { label }),
        ...(imgPath && { imgPath }),
        ...(workItemId && { workItemId }),
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update link ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await prisma.link.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete link ${error}` },
      { status: 500 }
    );
  }
}
