import { API_ENDPOINTS, API_URL } from '@/lib/apiConfig'
import { ESResponse, FullPost } from '@/lib/types/common'
import { Post } from '@prisma/client'
import { isAbortError } from 'next/dist/server/pipe-readable'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export async function handlePostDeletion(
  postId: string,
  routeCallback: () => void,
) {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.services.posts}?id=${postId}`,
      {
        method: 'DELETE',
      },
    )

    const { data }: { data: Post } = await response.json()

    if (!response.ok) {
      throw new Error('response not ok' + JSON.stringify(data))
    }

    routeCallback()
  } catch (error: unknown) {
    console.error(error)
  }
}

export async function fetchPosts(
  page = 1,
  signal?: AbortSignal,
  authorId?: string,
): Promise<ESResponse<FullPost[]>> {
  try {
    const apiRequestURL = !authorId
      ? `${API_URL}${API_ENDPOINTS.services.posts}?page=${page}`
      : `${API_URL}${API_ENDPOINTS.services.posts}?page=${page}&id=${authorId}`

    const response = await fetch(apiRequestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['revalidate-feed'] },
      signal,
    })

    if (!response.ok) {
      throw new Error("Response's not okay")
    }
    console.log(`fetch`)
    const { data }: { data: FullPost[] } = await response.json()

    return {
      data,
      error: null,
    }
  } catch (error: unknown) {
    if (isAbortError(error)) {
      console.log('feed aborted')

      return {
        data: null,
        error: 'Feed fetch aborted',
      }
    }

    console.error(error)

    return {
      data: null,
      error: 'Failed to fetch posts',
    }
  }
}
