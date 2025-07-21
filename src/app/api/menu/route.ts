import { PrismaClient } from '@/generated/prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const menu = await prisma.menu.findMany({
      include: {
        content: true,
      },
    })
    return NextResponse.json({ data: menu })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch menu, error: ${error}` },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { title, link } = await req.json()

    const menu = await prisma.menu.create({
      data: { title, link },
    })

    return NextResponse.json({ data: menu })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create menu, error: ${error}` },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, title, link } = await req.json()

    const menu = await prisma.menu.update({
      where: { id },
      data: { title, link },
    })

    return NextResponse.json({ data: menu })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update menu, error: ${error}` },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.menu.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Menu deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update menu, error: ${error}` },
      { status: 500 }
    )
  }
}
