/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license i.e. MIT
 */

'use client'

import React, { createContext } from 'react'
import styles from './PostSubmitFragment.module.scss'
import { useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const DynamicNewPostModal = dynamic(
  () => import('@/components/posts/postSubmit/NewPostModal'),
  { ssr: false },
)

type Disclosure = {
  isOpen?: boolean
  onClose?: () => void
}

export const NewPostContext = createContext<Disclosure>({})

export default function PostSubmitFragment() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <button
        className={`w-full mt-8 p-8 bg-gradient-to-tl bg-medium-gray text-darker-white hover:font-semibold rounded-xl hover:scale-[101%] text-start text-lg`}
        id={styles.textAnimation}
        onClick={onOpen}
      >
        Faça uma publicação
        <div id={styles.textSub}></div>
      </button>

      <NewPostContext.Provider value={{ isOpen, onClose }}>
        <DynamicNewPostModal />
      </NewPostContext.Provider>
    </>
  )
}
