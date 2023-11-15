'use client'

import React, { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {
  decreaseLikeCount,
  increaseLikeCount,
} from '@/app/(feed)/_serverActions'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import styles from '../../../../components/Buttons/buttons.module.scss'
import { LikeOptions } from '@/app/(feed)/_constants'

type LikeButtonParams = {
  params: {
    option: LikeOptions
    likes: number
    targetId: string | number
    isLiked: boolean
  }
}

export function LikeProjectButton({ params }: LikeButtonParams) {
  const { data: session } = useSession()

  const [isLiked, setIsLiked] = useState<boolean>(params.isLiked)
  const [optimisticLikes, setOptimisticLikes] = useState<number>(
    params.likes || 0,
  )

  async function handleLike() {
    if (!session?.user.id) {
      signIn()

      return
    }

    setIsLiked(!isLiked)

    // Update optimisticLikes based on the current state and the operation (increase or decrease)
    setOptimisticLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1))

    if (!isLiked) {
      await increaseLikeCount(params.option, session.user.id, params.targetId)
    } else {
      await decreaseLikeCount(params.option, params.targetId)
    }
  }

  return (
    <>
      <button
        onClick={handleLike}
        className={`like flex flex-col hover:text-medium-primary justify-center items-center w-[48px] ${
          isLiked ? styles.liked : 'text-darker-white'
        }`}
      >
        {isLiked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}

        <span>{optimisticLikes}</span>
      </button>
    </>
  )
}
