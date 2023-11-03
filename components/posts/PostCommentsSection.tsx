'use client'

import { deleteComment, postComment } from '@/app/(feed)/_serverActions'
import { FullPost, TDisplayComment } from '@/lib/types/common'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { validateForm } from '@/lib/schemas/comment.schema'
import { signIn } from 'next-auth/react'
import { LikeButton } from '../Buttons/LikeButton'
import { Like } from '@prisma/client'
import CreateCommentButton from '../Buttons/CreateCommentButton'
import Comment from '../comments/Comment'

// REVIEW - this code is a complete shitty mess
export default function PostCommentsSection({
  post,
  currentUserId,
}: {
  post: FullPost
  currentUserId?: string
}) {
  const [comments, setComments] = useState<Partial<TDisplayComment>[]>(
    post.comments,
  )

  const router = useRouter()
  const pathName = usePathname()

  function handleFacadeCommentSubmit(
    id: number,
    content: string,
    authorName: string,
  ) {
    setComments((prev) => [
      ...prev,
      {
        id,
        content,
        author: {
          name: authorName,
        },
      },
    ])
  }

  function handleFacadeCommentDeletion(id: number) {
    setComments((prev) => prev?.filter((prevComment) => prevComment.id !== id))
    router.replace(`${pathName}?update-comment=${id}`)
  }

  async function handleFormSubimission(formData: FormData) {
    if (!currentUserId) {
      signIn()

      return
    }

    const validatedData = validateForm(formData)

    if (validatedData.error) {
      let errorMessage = ''

      validatedData.error.issues.forEach((issue) => {
        errorMessage =
          errorMessage + issue.path[0] + ': ' + issue.message + '. \n'
      })

      alert('Algo no fomulário é invalido no campo: ' + errorMessage)

      return
    }

    const { data, error } = await postComment(validatedData.data)

    if (error || !data) {
      alert('failed to create comment')

      return
    }

    handleFacadeCommentSubmit(
      data,
      formData.get('content') as string,
      currentUserId,
    )

    router.replace(`${pathName}?update-comment=${data}`)
  }

  return (
    <div>
      <form action={handleFormSubimission} className="flex flex-col">
        <input type="hidden" name="author-id" value={currentUserId} />
        <input type="hidden" name="target-id" value={post.id} />

        <label htmlFor="content"></label>
        <textarea
          className="resize-none"
          name="content"
          title="content"
          id="contentk"
          rows={3}
          placeholder="Faça seu comentário"
        ></textarea>

        <CreateCommentButton />
      </form>

      <h2>Comments</h2>

      {comments.length > 0 &&
        comments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            currentUserId={currentUserId}
            handleFacadeCommentDeletion={handleFacadeCommentDeletion}
          />
        ))}
    </div>
  )
}
