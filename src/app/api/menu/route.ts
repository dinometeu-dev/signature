import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all menus
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: { content: true },
    });

    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch menus: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new menu
export async function POST(req: Request) {
  try {
    const { title, link } = await req.json();

    if (!title || !link) {
      return NextResponse.json(
        { error: 'title and link are required' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: { title, link },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create menu: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an existing menu
export async function PATCH(req: Request) {
  try {
    const { id, title, link } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.menu.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(link && { link }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update menu: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE a menu by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.menu.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'menu deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete menu: ${error}` },
      { status: 500 }
    );
  }
}
