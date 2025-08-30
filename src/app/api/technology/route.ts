import { PrismaClient } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany();
    return NextResponse.json({ technologies });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch technologies ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, iconPath } = body;

    if (!name || !iconPath) {
      return NextResponse.json(
        { error: 'Name and icon are required' },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.create({
      data: {
        name,
        iconPath,
      },
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create technology ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, iconPath } = body;

    if (!id || (!name && !iconPath)) {
      return NextResponse.json(
        { error: 'Invalid update data' },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(iconPath && { iconPath }),
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update technology ${error}` },
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
        { error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    await prisma.technology.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Technology deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete technology ${error}` },
      { status: 500 }
    );
  }
}
