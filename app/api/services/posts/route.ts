import { NextResponse } from 'next/server'
import { handleGet } from './_get'
import { handlePost } from './_post'
import { handleDelete } from './_delete'
import { handlePut } from './_put'
import { handlePatch } from './_patch'
import { Post } from '@prisma/client'

/**
 * @param req Request
 * @param id works as authorID for: GET, POST, and, as postID for: PUT, DELETE
 * @returns API Response. Into `{ data: "response data" }` format
 */
async function handler(req: Request): Promise<NextResponse> {
  const url = new URL(req.url)

  /**
   * - Works as authorID for: GET, POST
   * - Works as postID for: PUT, DELETE
   */
  const id: string | null = url.searchParams.get('id')

  const idIsNullErrorResponse = NextResponse.json(
    {
      data: `FAILED:SERVICES/${req.method}-Post::failed: authorId Can't be null`,
    },
    { status: 400 },
  )

  switch (req.method) {
    case 'GET': {
      const page: string | null = url.searchParams.get('page')

      return handleGet(page, id)
    }

    case 'POST': {
      if (!id) return idIsNullErrorResponse

      return handlePost(id, req)
    }

    case 'PATCH': {
      if (!id) return idIsNullErrorResponse

      const bodyData: Partial<Post> = await req.json()

      return handlePatch(id, bodyData)
    }

    case 'PUT': {
      if (!id) return idIsNullErrorResponse

      const bodyData: Post = await req.json()

      return handlePut(id, bodyData)
    }

    case 'DELETE': {
      if (!id) return idIsNullErrorResponse

      return handleDelete(id)
    }

    default:
      return NextResponse.json(
        { data: { message: 'Invalid method' } },
        { status: 401 },
      )
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
