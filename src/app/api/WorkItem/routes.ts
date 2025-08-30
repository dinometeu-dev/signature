import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all work items
export async function GET() {
  try {
    const items = await prisma.workItem.findMany({
      include: {
        menu: true,
        links: true,
        technologies: true,
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch work items: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new work item
export async function POST(req: Request) {
  try {
    const { title, description, iconPath, menuId } = await req.json();

    if (!title || !description || !iconPath || !menuId) {
      return NextResponse.json(
        { error: 'title, description, iconPath, and menuId are required' },
        { status: 400 }
      );
    }

    const item = await prisma.workItem.create({
      data: { title, description, iconPath, menuId },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create work item: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update a work item
export async function PATCH(req: Request) {
  try {
    const { id, title, description, iconPath, menuId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.workItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(iconPath && { iconPath }),
        ...(menuId && { menuId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update work item: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE a work item by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.workItem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Work item deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete work item: ${error}` },
      { status: 500 }
    );
  }
}
