import { PrismaClient } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const experienceBlocks = await prisma.experienceBlock.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        periods: true,
      },
    });
    return NextResponse.json({ data: experienceBlocks });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch experience blocks, error: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { companyName, imgPath, imageAlt, location, periods } =
      await req.json();

    const experienceBlock = await prisma.experienceBlock.create({
      data: {
        companyName,
        imgPath,
        imageAlt,
        location,
        periods: periods
          ? {
              create: periods,
            }
          : undefined,
      },
      include: {
        periods: true,
      },
    });

    return NextResponse.json({ data: experienceBlock });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create experience block, error: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, companyName, imgPath, imageAlt, location } = await req.json();

    const experienceBlock = await prisma.experienceBlock.update({
      where: { id },
      data: { companyName, imgPath, imageAlt, location },
      include: {
        periods: true,
      },
    });

    return NextResponse.json({ data: experienceBlock });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update experience block, error: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.experienceBlock.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Experience block deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete experience block, error: ${error}` },
      { status: 500 }
    );
  }
}
