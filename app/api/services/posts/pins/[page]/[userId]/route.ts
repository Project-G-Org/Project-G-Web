import { prisma } from '@/lib/database/prisma'
import { ESResponse, FullPost } from '@/lib/types/common'
import { ESFailed, ESSucceed } from '@/lib/types/helpers'
import { NextResponse } from 'next/server'

async function getPins(
  page: number,
  authorId: string,
): Promise<ESResponse<FullPost[]>> {
  const take = 3
  const skip = (page - 1) * take

  try {
    const publication: FullPost[] = await prisma.post.findMany({
      where: { pins: { some: { user: { id: authorId } } } },
      skip,
      // take,
      include: {
        author: {
          select: { name: true, image: true, profilePic: true },
        },
        contributor: { select: { name: true } },
        likes: { select: { id: true, userId: true } },
        pins: { select: { id: true, userId: true } },
        comments: {
          include: {
            author: { select: { name: true, profilePic: true, image: true } },
            likes: { select: { id: true, userId: true } },
            replies: {
              include: {
                author: {
                  select: { name: true, profilePic: true, image: true },
                },
                likes: { select: { id: true, userId: true } },
              },
            },
          },
        },
      },
    })

    return ESSucceed(publication)
  } catch (error: unknown) {
    return ESFailed(error)
  }
}

export async function GET(
  req: Request,
  { params }: { params: { page: string; userId: string } },
) {
  const { page, userId } = params
  const { data, error } = await getPins(Number(page), userId)

  if (error) {
    console.error(error)

    return NextResponse.json(
      { data: 'Failed to get pinned posts' },
      { status: 500 },
    )
  }

  return NextResponse.json({ data }, { status: 200 })
}
