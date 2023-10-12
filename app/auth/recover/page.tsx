/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license GPL 3.0
 */

'use client'

import { BsFillArrowLeftCircleFill } from 'react-icons/bs'
import { BgImage } from '@/components/BgImage'
import TextBox from '../components/TextBox'

export default function RegisterPage() {
  return (
    <main className="min-w-full flex max-w-full h-[calc(100vh-88px)]">
      <BgImage
        url={
          'https://images.unsplash.com/photo-1633354574427-b0dd0697130a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80'
        }
        alt={'SingInBgImage'}
      />
      <section
        id="loginContainer"
        className="min-w-full min-h-full flex items-center justify-center"
      >
        <div
          className={`absolute flex flex-col items-center rounded-xl bg-gradient-to-tl from-medium-tertiary to-medium-primary border-solid border-2 border-light-white text-darker-white p-16`}
        >
          <form className={`flex-col`}>
            <a
              href="/auth"
              className="hover:text-medium-secundary absolute -my-10 -mx-10"
            >
              <BsFillArrowLeftCircleFill size={32} />
            </a>
            <h1 className="md:text-base lg:text-lg x1:text-3xl mb-8 font-bold">
              {' '}
              RECUPERAR SENHA{' '}
            </h1>
            <TextBox className="w-full" labelText="E-mail" type={'email'} />
          </form>
        </div>
      </section>
    </main>
  )
}
