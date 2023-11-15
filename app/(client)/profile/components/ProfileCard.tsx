/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license i.e. MIT
 */

'use client'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Editable,
  EditablePreview,
  EditableInput,
  Divider,
  FormLabel,
  EditableTextarea,
  Box,
  IconButton,
  Avatar,
} from '@chakra-ui/react'

import { EditIcon } from '@chakra-ui/icons'
import { BsFillGearFill } from 'react-icons/bs'

import React, { FormEvent } from 'react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { updateUserPageData } from '@/app/(client)/profile/_actions'
import EditableAvatar from './EditableAvatar'
import Graduations from './Graduations'
import { getProfilePicURL } from '@/lib/uiHelpers/profilePicActions'

interface Params {
  user: Partial<User>
  isOwner: boolean
}

const defaultEditFormValues = {
  title: 'Insira seu titulo',
}

export default function ProfileCard({ user, isOwner }: Params) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  async function handleFormSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    /**
     * Helper function to get a field's value or default to an empty string
     */
    const getFieldValueOrDefault = (
      fieldName: string,
      defaultValue: string,
    ): string | null => {
      const fieldValue = formData.get(fieldName) as string | null

      return fieldValue === defaultValue ? '' : fieldValue
    }

    // Update form data for 'title' field
    formData.set(
      'title',
      getFieldValueOrDefault('title', defaultEditFormValues.title) ?? '',
    )

    const { data, error } = await updateUserPageData(
      formData,
      user.id as string,
    )

    if (error) {
      console.error('failed')
    }

    console.log(data)
    router.refresh()
  }

  return (
    <section
      id="Wrapper"
      className="flex h-[208px] min-w-full max-w-full items-center gap-[32px] py-0 px-[64px]"
    >
      {/* NOTE - Card BG */}
      <Box
        className="absolute w-[100%] h-[208px] overflow-visible ml-[-64px] z-99"
        bgImage={
          'https://lh3.googleusercontent.com/fife/AKsag4MR7T9EHVsTDyFG1gqEw7mxFb1BtXCsWJDrcxSNH6erLIIk7IByFL7zOpWKO5ldjCGldNxambQ56yVYI4ierHkmMjdCMfDFR7sLcTjEGdwseayprg9PWilSPCQN7CTYsjb3O9XzfVy-tDZY8StQ5CexgLTkcbc5oJMTEls7YO2oPL6EeQcovgT3vr-FIqOiyPlvzcJf8g1u7oSoVGgiUQqLerdCLwr_n-60a8mHkUOnI8DIejK352vN280U4v36EB_yckVCMkStuH4Yso23MrwHoLWICrvGC5VxPyTQJ4CMwxy7ruqYimbKxgtnJbT7AeUy6gsITCN_Jl5zC2OOrQk_4jDwjqpPZBgeJAPb5UXvnofge5EIQwvpTU3FABidqS0IGLSAstmo2S_3t614iwrKcCnWJm5EqvuxBFAh-NqX9fKFG7BD5vUGWnFvirSdsWVbX_Y06dyWvQcg4bEVqUdgigYGutS2BTO9eds1Ymp-dR_tQ5KAl8WjCpCvhgatg1IBPJRYIKsLXj2wAC2Fl7sojRabrZUvbjZ7am-YuZCRFSYJKAFsE1sUjbuUuIsORVbOOYEzkX4sVAffWrpfY3GHSCdTa9V3rRPW2DZvkC-qisg6-tDm2w5iCKor89JpYieZRlNwpCJWmkCwFCMdrJ8rZtQmPTUtcuSbDbYfgh9ydcX2YofUfrSD4Kuo7KjdrtYWNIMiooGikqkxmB2AvHgpcZg6jp-RppCBTuxxVXtIg69HemSPJXhjewk38gQQ9N7axxgAAQg38vBhwSa6HQk99PdoWP5T32C5-gcuz5nkR4h_9_0jihHwGJfQo5YLgj5Co-q43lq0Q648lf2FsbKJ_iDD9r6drARlKZMLeejOqBtzDtc13niGONTRSA4E8R9cVliktoViFeJsTtNcsg27sMy2ckqa5U7iZsgxAOS5WBt6zY9Ig7DYZ_TGtu64MPIshYe7_BrFUg-CMrlN5QHt7s0UPZIF3R3Fse75Wl62vSzA90bZnNRm0ZWyLNNQH8SYOH32jy4WSmryIj4SHog-M4zWLro-IUgxPtvtdTaKn4o0bwpNynxapOxIIzr_4kH4FQiOLNT3U9I0W2q53dYXdVNqYOtX7sYOl6bJPnr5iZ0s7EHFqF4uOm9suY0GtuHUCkn1VUmYwuKtLx7cADeKxwP9XEzSCAAKuL_VeM_iDm3d-fFmvL8FZPk6vG_20ImLemuVbFDtTr03R-u7CMDGqWkKOyoze8ZCkA7gHSRv1lbkolLRyAbpyPaM5Iyh4v7nDm17q6Md8NaUcdtdQIwlE70_2cJSvJ5GGL1sZn0f38Yvcj3QpsSPz9fTq9GWNvYQsVDlafHuTkLWPO1WU7sYRzZGavmY4Qksuigp0oVAd6bghY6LrH31bwEc16e4YIW9EJl3PWbSpq1aMGMS_GZmqaFNbdJRLRblTJYawntbcw9is-TKTXS53A4qA7mMBQ2DBUYrzrB9BzecGt4I-4jtXtebvro7X5uBKZxkq3d7SqdJdPCjpOKEHvDNlIxLbwGRwwp8lgPNQuJzRmERIIk61ucl2mILAdHMwSUl1QvuHEZ_Ga91Z_BuQQ7-kw=w1865-h961'
        }
        bgSize={'cover'}
      ></Box>
      <Box className="absolute w-[100%] h-[208px] bg-black bg-opacity-75 ml-[-64px]"></Box>

      {/* NOTE - Profile pic */}
      <div id="profile-avatar-wrapper">
        {isOwner ? (
          <EditableAvatar
            profileId={user.id as string}
            profilePicUrl={getProfilePicURL({
              profilePic: user.profilePic as string | null,
              image: user.image as string | null,
            })}
          />
        ) : (
          <div>
            <Avatar size={'2xl'} src={getProfilePicURL(user as User)} />
          </div>
        )}
      </div>

      {/* NOTE - Card info */}
      <div
        id="profile-info-wrapper"
        className="flex flex-row items-center w-[100%] h-[161px] gap-[75%] text-darker-white z-[1]"
      >
        <div id="info-name-wrapper" className="flex flex-col">
          <h1 className="text-4xl text-medium-primary font-bold">
            {user.name ?? ''}
          </h1>
          <h2 className="text-xl font-thin text-light-white">
            {user.title ?? ''}
          </h2>
        </div>
      </div>

      {/* NOTE - Card info editing and Graduation card */}
      <section className="h-full flex items-end flex-col-reverse justify-evenly">
        {user.graduations ?? (
          <Graduations
            Graduation={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/800px-Harvard_University_logo.svg.png'
            }
          />
        )}
        {isOwner && (
          <div>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsFillGearFill />}
                variant="outline"
                color={'white'}
                className="bg-pure-white bg-opacity-25 absolute hover:text-darker-gray"
              />

              <MenuList>
                <MenuItem icon={<EditIcon color="black" />} onClick={onOpen}>
                  Editar Perfil
                </MenuItem>
                <MenuItem icon={<BsFillGearFill color="black" />}>
                  Configurações
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>Modifique seu perfil</ModalHeader>
            <ModalCloseButton />

            <form onSubmit={handleFormSubmission}>
              <ModalBody>
                <FormLabel>Nome de Exibição</FormLabel>
                <Editable defaultValue={user.name}>
                  <EditablePreview />
                  <EditableTextarea name="display-name" id="display-name" />
                </Editable>

                <FormLabel>Título</FormLabel>
                <Editable
                  defaultValue={user.title || defaultEditFormValues.title}
                  isPreviewFocusable={true}
                >
                  <EditablePreview />
                  <EditableInput
                    display="insira um título"
                    type="text"
                    name="title"
                    id="title"
                  />
                </Editable>

                <Divider />
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>

                <Button colorScheme="blue" mr={3} type="submit">
                  Salvar
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </section>
    </section>
  )
}
