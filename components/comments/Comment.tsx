'use client'

import { TDisplayComment } from '@/lib/types/common'
import React from 'react'
// import { deleteComment } from '@/app/(feed)/_serverActions'
import { LikeButton } from '../Buttons/LikeButton'
import { BsThreeDots } from 'react-icons/bs'
import { Like, User } from '@prisma/client'
// import ReplyDialog from './ReplyDialog'
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { getProfilePicURL } from '@/lib/uiHelpers/profilePicActions'
import { deleteComment } from '@/app/(feed)/_serverActions'
import ReplyDialog from './ReplyDialog'
import Link from 'next/link'

type Props = {
  comment: Partial<TDisplayComment>
  currentUserId?: string
  handleFacadeCommentDeletion?: (id: number) => void
  fromPost: string
}

export default function Comment({
  comment,
  currentUserId,
  handleFacadeCommentDeletion,
  fromPost,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isOwner = currentUserId === comment.authorId

  return (
    <div className="w-full flex bg-darker-white rounded-lg my-4 items-center justify-center p-2">
      {/* <button onClick={onOpen}>opendialogo</button>
      <ReplyDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        repliedCommentId={comment.id as number}
        currentUserId={currentUserId}
        fromPost={fromPost}
      /> */}

      <Avatar size={'lg'} src={getProfilePicURL(comment.author as User)} />
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

      <div id="replies">
        {comment.replies?.map((reply, index) => (
          <div key={index}>
            <h1>subComments</h1>

            <Comment
              comment={reply}
              currentUserId={currentUserId}
              handleFacadeCommentDeletion={handleFacadeCommentDeletion}
              fromPost={fromPost}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
