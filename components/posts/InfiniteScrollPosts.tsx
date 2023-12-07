'use client'

import React, { createContext } from 'react'
import { useFeed } from '@/hooks/useFeed'
import { FullPost } from '@/lib/types/common'
import { useInView } from 'react-intersection-observer'
import { fetchPosts } from '@/app/(feed)/_actions'
import dynamic from 'next/dynamic'

const DynamicPostItem = dynamic(() => import('./PostItem'), {
  ssr: false,
  loading: () => (
    // TODO - SKELETON POST Progess for optimization (Using chakra -> 122kb, without chakra -> 96kb)
    <h2>Carregando...</h2>
  ),
})

export const PublicationContext = createContext<
  (FullPost & { session: string }) | null
>(null)

type Params = {
  initialPublication: FullPost[] | undefined
  session: string
  profileId?: string
}

export default function InfiniteScrollPosts({
  initialPublication,
  session,
  profileId,
}: Params) {
  const [ref, inView] = useInView()
  const { publications: posts, noPublicationFound: noPostFound } = useFeed(
    initialPublication,
    inView,
    fetchPosts,
    profileId,
  )

  return (
    <section id="feed">
      {posts?.map((post: FullPost) => (
        <div key={post.id} className="max-w-full">
          <PublicationContext.Provider value={{ ...post, session }}>
            <DynamicPostItem />
          </PublicationContext.Provider>
        </div>
      ))}

      {/* loading spinner */}
      {noPostFound ? (
        <span className="col-span-1 mt-8 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
          Ops, parece que você chegou ao fim!
        </span>
      ) : (
        <div
          ref={ref}
          className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4"
        >
          {/* TODO: Implement custom CircularProgress (Using chakra -> 122kb, without chakra -> 96kb) */}
          {/* <CircularProgress
            isIndeterminate
            color="black"
            size={8}
            marginBottom={8}
          /> */}
          <h2>Carregando...</h2>
        </div>
      )}
    </section>
  )
}
