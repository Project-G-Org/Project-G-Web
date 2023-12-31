/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license i.e. MIT
 */

import { prisma } from '@/lib/database/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

type RegisterResponse = NextResponse<unknown>

async function handlePost(req: Request): Promise<RegisterResponse> {
  try {
    const formData = await req.formData()

    // Required in the form
    const name = formData.get('name')?.toString()
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    if (!name || !email || !password)
      throw new Error("Form fields can't be null")

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    if (!user) {
      console.error('not user')

      return NextResponse.json(
        {
          data: 'User Not created for some reason',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      data: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        data: 'failed' + error,
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request): Promise<RegisterResponse> {
  if (req.method === 'POST') {
    return await handlePost(req)
  }

  return NextResponse.json({ data: 'Method not allowed' }, { status: 405 })
}
