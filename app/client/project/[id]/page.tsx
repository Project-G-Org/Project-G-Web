import React from 'react'
import { ProjectInterface } from '@/common.types'
import { Post } from '@/lib/database/table.types'

type Props = {
  params: {
    id: string
  }
}

const Project = async ({ params }: Props) => {
  const feedData: Post | null = await prisma.post.findUnique({
    where: { id: params?.id },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  return <h1>{feedData?.author?.name}</h1>
}

export default Project
