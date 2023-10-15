'use client'
import '@/app/styles/navbar.css'
import { StaticImage } from '../Image'
import { useSession } from 'next-auth/react'
import React from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'
import { MdClose } from 'react-icons/md'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = React.useState(false)

  function ToggleMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <nav
        id="navDesktop"
        className="flex h-[88px] w-full justify-around shadow-darker-white/40 shadow-2xl bg-medium-gray text-darker-white items-center text-xl"
      >
        <ul className="flex flex-row">
          <li>
            <a href="../client/explore">
              Explorar
              <div></div>
            </a>
          </li>
          <li>
            <a href="../client/projects">
              Projetos
              <div></div>
            </a>
          </li>
          <li>
            <a href="/">
              <StaticImage
                url={
                  'https://ebqqbabyixbmiwalviko.supabase.co/storage/v1/object/public/Vampeta-Images-Public/static-images/logo.png'
                }
                alt={'logo'}
                className={''}
              />
            </a>
          </li>
          <li>
            <a href="../client/search">
              Busca
              <div></div>
            </a>
          </li>
          <li>
            {session ? (
              <a href={`../client/profile/${session?.user.id}`}>
                Perfil
                <div></div>
              </a>
            ) : (
              <a href="/auth">
                Logar
                <div></div>
              </a>
            )}
          </li>
        </ul>
      </nav>
      <nav id="navMobile">
        <div className="flex h-[88px] w-full shadow-darker-white/40 shadow-2xl bg-medium-gray text-darker-white items-center text-xl">
          <button
            type="button"
            onClick={ToggleMenu}
            id="menuLines"
            className={menuOpen ? 'closeMenu' : 'hamburguerMenu'}
          >
            {menuOpen ? <MdClose size="32" /> : <RxHamburgerMenu size="32" />}
          </button>

          <section
            className="absolute flex w-full items-center justify-center"
            id="mobileLogoContainer"
          >
            <a href="/" className="">
              <StaticImage
                url={
                  'https://ebqqbabyixbmiwalviko.supabase.co/storage/v1/object/public/Vampeta-Images-Public/static-images/logo.png'
                }
                alt={'logo'}
                className={''}
              />
            </a>
          </section>
        </div>
        <ul
          id="mobileMenuItems"
          className={menuOpen ? 'displayMenu' : 'hideMenu'}
        >
          <a href="/" className="w-full">
            <li className="p-4 hover:bg-darker-white">Feed</li>
          </a>
          <hr className="h-px bg-black/25 border-0" />
          <a href="../client/explore" className="w-full">
            <li className="p-4 hover:bg-darker-white">Explorar</li>
          </a>
          <hr className="h-px bg-black/25 border-0" />
          <a href="../client/projects" className="w-full">
            <li className="p-4 hover:bg-darker-white">Projetos</li>
          </a>
          <hr className="h-px bg-black/25 border-0" />
          <a href="../client/search" className="w-full">
            <li className="p-4 hover:bg-darker-white">Busca</li>
          </a>
          <hr className="h-px bg-black/25 border-0" />

          {session ? (
            <a
              href={`../client/profile/${session?.user.id}`}
              className="w-full"
            >
              <li className="p-4 hover:bg-darker-white">Perfil</li>
            </a>
          ) : (
            <a href="/auth" className="w-full">
              <li className="p-4 hover:bg-darker-white">Logar</li>
            </a>
          )}
        </ul>
      </nav>
    </>
  )
}
