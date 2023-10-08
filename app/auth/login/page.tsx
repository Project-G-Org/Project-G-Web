'use client'

/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license i.e. MIT
 */

import React, { useRef } from 'react'
import { BgImage } from '@/components/bgImage'
import { StaticImage } from '@/components/Image'
import TextBox from '../components/elements/textBox'
import Button from '../components/elements/button'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const email = useRef('')
  const password = useRef('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(email.current + password.current)
    signIn('credentials', {
      email: email.current,
      password: password.current,
      redirect: true,
      callbackUrl: '/',
    })
  }

  return (
    <main className="min-w-full max-w-full md:h-[calc(100vh-88px)] ">
      <BgImage
        url={
          'https://images.unsplash.com/photo-1633354574427-b0dd0697130a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80'
        }
        alt={'SingInBgImage'}
      />
      <section className="absolute flex mx-[5%] my-[calc((100vh-88px-75vh)/2)] w-[90%] lg:w-[65%] lg:mx-[17.5%] h-[75vh] rounded-xl bg-pure-white/75">
        <section
          id="login-section"
          className="w-full sm:w-[65%] h-full flex flex-col items-center justify-center"
        >
          <h1 className="text-xl">Login</h1>
          <form
            onSubmit={onSubmit}
            className="w-[80%] flex flex-col items-center gap-4"
          >
            <TextBox
              className="w-full"
              labelText="E-mail"
              type={'email'}
              onChange={(e) => (email.current = e.target.value)}
            />
            <TextBox
              className="w-full"
              labelText="Senha"
              type={'password'}
              onChange={(e) => (password.current = e.target.value)}
            />
            <Button type="submit">Logar</Button>
          </form>
          <p>
            Precisa criar uma conta? {''}
            <a
              href="/auth/register"
              className="text-[#1e3a8a] underline hover:text-[#4338ca]"
            >
              Crie aqui
            </a>{' '}
            {''}
          </p>
        </section>
        <section
          id="image-section"
          className="hidden sm:block w-[50%] h-[100%] py-[2.5%] rounded-xl"
        >
          <StaticImage
            url={
              'https://ebqqbabyixbmiwalviko.supabase.co/storage/v1/object/public/Vampeta-Images-Public/static-images/singin-image.png'
            }
            alt={'Sing-in Image'}
            className={'w-full h-full object-cover rounded-xl'}
          />
        </section>
      </section>
    </main>
  )
}
