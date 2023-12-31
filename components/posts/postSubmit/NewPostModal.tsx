'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalHeader,
} from '@chakra-ui/react'
import { signIn, useSession } from 'next-auth/react'
import React, { useContext } from 'react'
import { NewPostContext } from './PostSubmitFragment'
import { PostSubmitForm } from './PostSubmitForm'

export default function NewPostModal() {
  const { data: session } = useSession()
  const { isOpen, onClose } = useContext(NewPostContext)

  return (
    <div>
      <Modal
        isOpen={isOpen as boolean}
        onClose={onClose as () => void}
        size={'4xl'}
        isCentered
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody height={'100%'} padding={8}>
            {session?.user.id ? (
              <PostSubmitForm />
            ) : (
              <>
                <h2>Primeiro faça login para espalhar sua criatividade!</h2>

                <Button onClick={() => signIn(undefined, { callbackUrl: '/' })}>
                  Login
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
