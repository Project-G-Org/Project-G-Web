import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiSolidShare } from 'react-icons/bi'
import { AiFillWarning } from 'react-icons/ai'
import DeletePostButton from '../Buttons/DeletePostButton'

interface Props {
  postId: string
  isOwner: boolean
}

export default function PostSettings({ postId, isOwner }: Props) {
  const [dropDownMenu, setDropDownMenu] = useState(false)

  const dropDownMenuRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(e.target as Node)
      ) {
        setDropDownMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropDownMenuRef])

  return (
    <section>
      <button
        onClick={() => {
          setDropDownMenu(!dropDownMenu)
        }}
      >
        <BsThreeDotsVertical size={'24'} />
      </button>
      {dropDownMenu ? (
        <ul
          className="absolute py-4 px-1 bg-light-gray text-darker-white rounded-lg"
          ref={dropDownMenuRef}
        >
          <li className="w-full p-2 flex gap-4 bg-light-gray hover-bg-darker-gray">
            <BiSolidShare size={20} />
            <button>Compartilhar Publicação</button>
          </li>
          {!isOwner ? (
            <li className="w-full p-2 flex gap-4 bg-light-gray hover-bg-darker-gray">
              <AiFillWarning size={20} />
              <button>Denunciar Publicação</button>
            </li>
          ) : null}
          {isOwner ? (
            <li className="w-full p-2 bg-light-gray hover-bg-darker-gray">
              <DeletePostButton postId={postId} />
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  )
}
