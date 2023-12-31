import { API_ENDPOINTS, API_URL } from '@/lib/api/apiConfig'
import { ESResponse, PostType } from '@/lib/types/common'
import { ESFailed, ESSucceed } from '@/lib/types/helpers'
import { Post } from '@prisma/client'
import { isAbortError } from 'next/dist/server/pipe-readable'
import { toast } from 'react-toastify'

export async function handlePostDeletion(
  postId: string,
  routeCallback: () => void,
) {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.services.posts}?id=${postId}`,
      {
        method: 'DELETE',
        headers: {
          'X-API-Key': process.env.API_SECRET as string,
        },
      },
    )

    const { data }: { data: Post } = await response.json()

    if (!response.ok) {
      throw new Error('response not ok' + JSON.stringify(data))
    }

    routeCallback()
  } catch (error: unknown) {
    console.error(error)

    toast.error('Houve um erro ao deletar seu post! 🤯')
  }
}

/**
 * Fetch multiple posts
 * @param page
 * @param signal
 * @param authorId
 * @returns array of posts
 */
export async function fetchPosts(
  page = 1,
  signal?: AbortSignal,
  authorId?: string,
): Promise<ESResponse<PostType[]>> {
  try {
    const apiRequestURL = !authorId
      ? `${API_URL}${API_ENDPOINTS.services.posts}?page=${page}`
      : `${API_URL}${API_ENDPOINTS.services.posts}?page=${page}&id=${authorId}`

    const response = await fetch(apiRequestURL, {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.API_SECRET as string,
        'Content-Type': 'application/json',
      },
      next: { tags: ['revalidate-feed'] },
      signal,
    })

    if (!response.ok) {
      const { data }: { data: string } = await response.json()

      throw new Error("Response's not okay " + data)
    }

    const { data }: { data: PostType[] } = await response.json()

    return {
      data,
      error: null,
    }
  } catch (error: unknown) {
    if (isAbortError(error)) {
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

export async function createNewPost(
  id: string,
  formData: FormData,
): Promise<ESResponse<string>> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.services.posts}?id=${id}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'X-API-Key': process.env.API_SECRET as string,
        },
      },
    )

    const { data }: { data: string } = await response.json()

    if (!response.ok) {
      throw new Error('response not ok' + JSON.stringify(data))
    }

    return ESSucceed(data)
  } catch (error: unknown) {
    console.error(error)

    return ESFailed(error)
  }
}
