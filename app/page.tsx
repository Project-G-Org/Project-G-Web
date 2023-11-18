/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license GPL 3.0
 */

// REVIEW - Chakra Modals may be adding too much memory cost.

import InfiniteScrollPosts from '@/components/posts/InfiniteScrollPosts'
import PostSubmitFragment from '@/components/posts/postSubmit/PostSubmitFragment'
import { FullPost } from '@/lib/types/common'
import { fetchPosts } from './(feed)/_actions'
import { Suspense } from 'react'
import NewPostModal from '@/components/posts/postSubmit/NewPostModal'

export default async function Home() {
  const posts = await fetchPosts<FullPost>()

  return (
    <main className="flex min-h-screen justify-around flex-row bg-darker-white">
      <div className="feed flex flex-col items-center min-w-full sm:min-w-[480px] md:min-w-[680px] lg:min-w-[800px]">
        <PostSubmitFragment modal={<NewPostModal />} />

        <Suspense fallback={<span>loading feed...</span>}>
          {!posts.error ? (
            <div className="min-w-full sm:min-w-[480px] md:min-w-[680px] lg:min-w-[800px]">
              <InfiniteScrollPosts
                initialPublication={posts.data ?? undefined}
              />
            </div>
          ) : (
            <h1>Feed Failed to load</h1>
          )}
        </Suspense>
      </div>
    </main>
  )
}
