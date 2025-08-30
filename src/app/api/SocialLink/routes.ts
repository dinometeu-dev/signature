import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all social links
export async function GET() {
  try {
    const links = await prisma.socialLink.findMany();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch social links: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new social link
export async function POST(req: Request) {
  try {
    const { url, iconPath, alt } = await req.json();

    if (!url || !iconPath || !alt) {
      return NextResponse.json(
        { error: 'url, imgPath, and alt are required' },
        { status: 400 }
      );
    }

    const link = await prisma.socialLink.create({
      data: { url, iconPath, alt },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create social link: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an existing social link
export async function PATCH(req: Request) {
  try {
    const { id, url, iconPath, alt } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: {
        ...(url && { url }),
        ...(iconPath && { imgPath: iconPath }),
        ...(alt && { alt }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update social link: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE a social link by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.socialLink.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Social link deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete social link: ${error}` },
      { status: 500 }
    );
  }
}
