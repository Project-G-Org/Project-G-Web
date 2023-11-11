'use client'

import { PublicationAuthor, TDisplayComment } from '@/lib/types/common'
import React from 'react'
import { LikeButton } from '../Buttons/LikeButton'
import { BsThreeDots } from 'react-icons/bs'
import { Like } from '@prisma/client'
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { getProfilePicURL } from '@/lib/uiHelpers/profilePicActions'
import { deleteComment } from '@/app/(feed)/_serverActions'
import Link from 'next/link'
import ReplyDialog from './ReplyDialog'

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
    <section className="w-full flex flex-col bg-darker-white rounded-lg my-4 items-start justify-center p-2">
      <div className="flex w-full">
        <Avatar
          size={'lg'}
          src={getProfilePicURL(comment.author as PublicationAuthor)}
        />
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
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots size={20} />}
                variant="ghost"
                color={'#242424'}
                className="bg-opacity-25 absolute hover:text-darker-gray"
              ></MenuButton>

              <MenuList>
                <MenuItem padding={0}>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={async () => {
                      if (handleFacadeCommentDeletion) {
                        handleFacadeCommentDeletion(comment.id as number)
                      }

                      await deleteComment(comment.id as number)
                    }}
                  >
                    Excluir Comentário
                  </Button>
                </MenuItem>
              </MenuList>
            </Menu>
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

      <ReplyDialog
        repliedCommentId={comment.id as number}
        currentUserId={currentUserId}
        fromPost={fromPost}
        handleFacadeCommentSubmit={handleFacadeCommentSubmit}
      />

      <div id="replies">
        {comment.replies?.map((reply, index) => (
          <div key={index}>
            <h1>subComments</h1>

            <Comment
              comment={reply}
              currentUserId={currentUserId}
              handleFacadeCommentDeletion={handleFacadeCommentDeletion}
              handleFacadeCommentSubmit={handleFacadeCommentSubmit}
              fromPost={fromPost}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
