'use client'

import { PublicationAuthor, TDisplayComment } from '@/lib/types/common'
import React from 'react'
import { LikeButton } from '../Buttons/LikeButton'
import { Like } from '@prisma/client'
import { Avatar } from '@chakra-ui/react'
import { getProfilePicURL } from '@/lib/uiHelpers/profilePicActions'
import Link from 'next/link'
import ReplyDialog from './ReplyDialog'
import CommentReply from './CommentReply'
import MenuSettings from './MenuSettings'

type Props = {
  comment: Partial<TDisplayComment>
  currentUserId?: string
  handleFacadeCommentDeletion?: (id: number) => void
  handleFacadeCommentSubmit: (commentData: Partial<TDisplayComment>) => void
  fromPost: string
}

export default function Comment({
  comment,
  currentUserId,
  handleFacadeCommentDeletion,
  handleFacadeCommentSubmit,
  fromPost,
}: Props) {
  const isOwner = currentUserId === comment.authorId

  return (
    <div className="flex flex-col items-end">
      <section className="w-full flex flex-col bg-darker-white rounded-lg my-2 items-start justify-center p-2">
        <div className="flex w-full">
          <Link
            href={`/profile/${comment.authorId}`}
            className="capitalize px-2 font-semibold"
          >
            <Avatar
              size={'lg'}
              src={getProfilePicURL(comment.author as PublicationAuthor)}
            />
          </Link>
          <div className="flex flex-col w-full">
            <Link
              href={`/profile/${comment.authorId}`}
              className="capitalize px-2 font-semibold"
            >
              {comment.author?.name}
            </Link>

            <label htmlFor="content"></label>
            <article
              title="content"
              id="content"
              className="resize-none w-full bg-darker-white rounded-lg p-2 ml-2"
            >
              {comment.content}
            </article>
          </div>

          <div className="flex flex-col items-center justify-center">
            {isOwner ? (
              <MenuSettings
                comment={comment}
                handleFacadeCommentDeletion={handleFacadeCommentDeletion}
              />
            ) : null}
            <LikeButton
              params={{
                option: 'commentId',
                likes: comment.likes?.length ?? 0,
                targetId: comment.id as number,
                authorId: currentUserId,
                isLiked:
                  comment.likes?.some(
                    (like: Partial<Like>) => like.userId === currentUserId,
                  ) ?? false,
              }}
            />
          </div>
        </div>
      </section>

      <section className="w-[95%] p-2 mb-4 rounded-md">
        <div id="replies">
          {comment.replies?.map((reply, index) => (
            <div key={index}>
              <CommentReply
                comment={reply}
                currentUserId={currentUserId}
                handleFacadeCommentDeletion={handleFacadeCommentDeletion}
                handleFacadeCommentSubmit={handleFacadeCommentSubmit}
                fromPost={fromPost}
              />
            </div>
          ))}
        </div>

        <ReplyDialog
          repliedCommentId={comment.id as number}
          currentUserId={currentUserId}
          fromPost={fromPost}
          handleFacadeCommentSubmit={handleFacadeCommentSubmit}
        />
      </section>
    </div>
  )
}
