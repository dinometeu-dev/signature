import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all technologies
export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      include: { workItems: true },
    });
    return NextResponse.json(technologies);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch technologies: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new technology
export async function POST(req: Request) {
  try {
    const { name, iconPath } = await req.json();

    if (!name || !iconPath) {
      return NextResponse.json(
        { error: 'name and iconPath are required' },
        { status: 400 }
      );
    }

    const tech = await prisma.technology.create({
      data: { name, iconPath },
    });

    return NextResponse.json(tech, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create technology: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an existing technology
export async function PATCH(req: Request) {
  try {
    const { id, name, iconPath } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.technology.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(iconPath && { iconPath }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update technology: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE a technology by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.technology.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'technology deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete technology: ${error}` },
      { status: 500 }
    );
  }
}
