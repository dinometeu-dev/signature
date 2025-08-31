import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all work item links
export async function GET() {
  try {
    const links = await prisma.workItemLink.findMany({
      include: { workItem: true },
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch work item links: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new work item link
export async function POST(req: Request) {
  try {
    const { url, label, iconPath, workItemId } = await req.json();

    if (!url || !workItemId) {
      return NextResponse.json(
        { error: 'url and workItemId are required' },
        { status: 400 }
      );
    }

    const link = await prisma.workItemLink.create({
      data: { url, label, iconPath, workItemId },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create work item link: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an existing work item link
export async function PATCH(req: Request) {
  try {
    const { id, url, label, iconPath, workItemId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.workItemLink.update({
      where: { id },
      data: {
        ...(url && { url }),
        ...(label && { label }),
        ...(iconPath && { iconPath }),
        ...(workItemId && { workItemId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update work item link: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE a work item link by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.workItemLink.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Work item link deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete work item link: ${error}` },
      { status: 500 }
    );
  }
}
