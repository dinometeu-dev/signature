import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all experience periods
export async function GET() {
  try {
    const periods = await prisma.experiencePeriod.findMany({
      include: { experienceBlock: true },
    });
    return NextResponse.json(periods);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch experience periods: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new experience period
export async function POST(req: Request) {
  try {
    const { position, startDate, endDate, experienceBlockId } =
      await req.json();

    if (!position || !startDate || !experienceBlockId) {
      return NextResponse.json(
        { error: 'position, startDate, and experienceBlockId are required' },
        { status: 400 }
      );
    }

    const period = await prisma.experiencePeriod.create({
      data: {
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        experienceBlockId,
      },
    });

    return NextResponse.json(period, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create experience period: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an experience period
export async function PATCH(req: Request) {
  try {
    const { id, position, startDate, endDate, experienceBlockId } =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.experiencePeriod.update({
      where: { id },
      data: {
        ...(position && { position }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(experienceBlockId && { experienceBlockId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update experience period: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE an experience period by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.experiencePeriod.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Experience period deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete experience period: ${error}` },
      { status: 500 }
    );
  }
}
