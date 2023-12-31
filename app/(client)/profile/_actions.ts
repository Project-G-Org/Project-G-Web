import { API_ENDPOINTS, API_URL } from '@/lib/api/apiConfig'
import { ESResponse, UserData } from '@/lib/types/common'
import { User } from '@prisma/client'
import { isFollowing } from './_server-actions'
import { ESFailed, ESSucceed } from '@/lib/types/helpers'
import { requestFactory } from '@/lib/api/requestHandler'

export type UserSelectedData = { [key in keyof Partial<User>]: boolean }

/**
 * @author Gabriel Spinola
 *
 * @param id Id of the user as a string.
 * @param requestData the specific data from the user you want to request.
 * @returns the requested data from the user or, if failed, null.
 */
export async function getUserData(id: string): Promise<UserData | null> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.services.users}only/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.API_SECRET as string,
        },
        next: { tags: ['user-data'] },
      },
    )

    if (!response.ok) throw new Error('Response not ok')

    const { data }: { data: UserData } = await response.json()

    return data
  } catch (error: unknown) {
    console.error(error, 'Failed to fetch users')

    return null
  }
}

export async function changeProfilePic(
  id: string,
  formData: FormData,
): Promise<ESResponse<string>> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.services.users}image/${id}`,
      {
        method: 'PUT',
        body: formData,
        headers: {
          'X-API-Key': process.env.API_SECRET as string,
        },
      },
    )

    const { data }: { data: string } = await response.json()

    if (!response.ok || !data) {
      throw new Error('response not ok' + JSON.stringify(data))
    }

    return ESSucceed(data)
  } catch (error: unknown) {
    console.error(error)

    return ESFailed(error)
  }
}

/**
 *
 * @param authorId
 * @param targetId
 * @param isOwner
 * @returns isFollowing
 */
export async function handleFollowingCheckage(
  authorId: string,
  targetId: string,
  isOwner: boolean,
): Promise<boolean> {
  if (isOwner) {
    return false
  }

  const { data, error } = await isFollowing(authorId, targetId)

  if (error) {
    console.error('Failed to check following')

    return false
  }

  return data ?? false
}

export const updateUserInfo = requestFactory<Partial<UserData>, string>(
  (params) =>
    fetch(`${API_URL}${API_ENDPOINTS.services.users}/only/${params.id}/`, {
      method: 'PATCH',
      headers: {
        'X-API-Key': process.env.API_SECRET as string,
      },
      body: JSON.stringify(params),
    }),
)
