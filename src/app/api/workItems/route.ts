import { PrismaClient } from '@/generated/prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')

    if (idParam) {
      const id = Number(idParam)

      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid ID provided' },
          { status: 400 }
        )
      }

      const workItem = await prisma.workItem.findUnique({
        where: { id },
        include: {
          links: true,
          technologies: true,
          menu: true,
        },
      })

      if (!workItem) {
        return NextResponse.json(
          { error: `Work item with ID ${id} not found` },
          { status: 404 }
        )
      }

      return NextResponse.json({ data: workItem })
    }

    const workItems = await prisma.workItem.findMany({
      include: {
        links: true,
        technologies: true,
        menu: true,
      },
    })
    return NextResponse.json({ data: workItems })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch work item(s), error: ${error}` },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, image, menuId, links, technologies } =
      await req.json()

    const workItem = await prisma.workItem.create({
      data: {
        title,
        description,
        image,
        menuId,
        links: {
          create: links.map((item: { name: string; link: string }) => ({
            label: item.name,
            url: item.link,
          })),
        },
        technologies: {
          connectOrCreate: technologies.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        links: true,
        technologies: true,
        menu: true,
      },
    })

    return NextResponse.json({ data: workItem })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create work item, error: ${error}` },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, title, description, image, menuId, links, technologies } =
      await req.json()

    await prisma.link.deleteMany({ where: { workItemId: id } })

    const workItem = await prisma.workItem.update({
      where: { id },
      data: {
        title,
        description,
        image,
        menuId,
        links: {
          create: links.map((url: string) => ({ url })),
        },
        technologies: {
          set: [],
          connectOrCreate: technologies.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        links: true,
        technologies: true,
        menu: true,
      },
    })

    return NextResponse.json({ data: workItem })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update work item, error: ${error}` },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.workItem.delete({ where: { id } })

    return NextResponse.json({ message: 'Work item deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete work item, error: ${error}` },
      { status: 500 }
    )
  }
}
