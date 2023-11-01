import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiSolidShare } from 'react-icons/bi'
import { AiFillWarning } from 'react-icons/ai'
import { GiExpand } from 'react-icons/gi'
import DeletePostButton from '../Buttons/DeletePostButton'
import { $Enums } from '@prisma/client'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { FullPost } from '@/lib/types/common'
import Link from 'next/link'

interface Props {
  post: FullPost
  isOwner: boolean
  currentUserPosition: $Enums.Positions | undefined
}

export default function PostSettings({
  post,
  isOwner,
  currentUserPosition,
}: Props) {
  function CopyLink() {
    const postUrl = window.location.hostname + `/posts/${post.id}`
    navigator.clipboard.writeText(postUrl)
    alert('Link da publicação copiado')
  }

  return (
    <div className="flex">
      <Link
        className="flex p-2 w-[40px] h-[40px] items-center justify-center hover:bg-[#EDF2F7] rounded-md"
        href={`/posts/${post.id}`}
      >
        <GiExpand size={20} color={'#242424'} />
      </Link>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<BsThreeDotsVertical size={20} />}
          variant="ghost"
          color={'#242424'}
          className="bg-pure-white bg-opacity-25 absolute hover:text-darker-gray"
        ></MenuButton>
        <MenuList
          paddingY={2}
          width={72}
          shadow={'lg'}
          bg={'#262626'}
          textColor={'#ebebeb'}
        >
          <MenuItem bg={'#262626'} _hover={{ bg: '#202020' }} gap={'16px'}>
            <span onClick={CopyLink}>
              <BiSolidShare size={20} />
              Compartilhar publicação
            </span>
          </MenuItem>
          {!isOwner ? (
            <MenuItem bg={'#262626'} _hover={{ bg: '#202020' }} gap={'16px'}>
              <AiFillWarning size={20} />
              Denunciar publicação
            </MenuItem>
          ) : null}
          {isOwner || currentUserPosition === $Enums.Positions.Admin ? (
            <>
              <MenuItem bg={'#262626'} _hover={{ bg: '#202020' }}>
                <DeletePostButton postId={post.id} />
              </MenuItem>
            </>
          ) : null}
        </MenuList>
      </Menu>
    </div>
  )
}
