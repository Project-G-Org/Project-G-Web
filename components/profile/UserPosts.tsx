import { fetchPosts, revalidateFeed } from '@/app/feedActions'
import InfiniteScrollPosts from '../posts/InfiniteScrollPosts'
import PostSubmitFragment from '../posts/poster/PostSubmitFragment'
import { ESResponse, FullPost } from '@/lib/types/common'

type Params = { authorID: string }

export default async function UserPosts({ authorID }: Params) {
  const { data, error }: ESResponse<FullPost[]> = await fetchPosts(1, authorID)

  return (
    <section id="PostWrapper" className="flex flex-col">
      <PostSubmitFragment />

      {!error ? (
        <>
          {data && data?.length > 0 ? (
            <InfiniteScrollPosts
              initialPublication={data || undefined}
              revalidate={revalidateFeed}
            />
          ) : (
            <>Oops você chegou ao fim!</>
          )}
        </>
      ) : (
        <h1>Feed Failed to load</h1>
      )}
    </section>
  )
}