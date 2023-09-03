import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/database/prisma'
import { Credentials, User, html, text, validateCredentials } from './actions'
import { sign } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'

/* NOTE
I added the randomKey to the configuration simply to demonstrate that any additional information can be included in the session. It doesn’t have a specific purpose or functionality within the code. Its purpose is solely to illustrate the flexibility of including custom data or variables in the session.
*/

function generateJwtToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  }

  const token = sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: 30 * 24 * 60 * 60,
  })
  return token
}

export const AuthOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials) {
        const user: User | null = await validateCredentials(credentials)

        if (!user) {
          console.log('uai')

          return null
        }

        const token = generateJwtToken(user)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          token,
        }
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: process.env.EMAIL_SERVER_PORT as string,
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        },
      },
      from: process.env.EMAIL_FROM as string,
      async sendVerificationRequest(params: {
        identifier: email
        url
        provider: { server; from }
        theme
      }) {
        const { host } = new URL(params.url)

        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(params.provider.server)
        const result = await transport.sendMail({
          to: params.identifier,
          from: params.provider.from,
          subject: `Sign in to ${host}`,
          text: text({ url: params.url, host }),
          html: html({ url: params.url, host, theme: params.theme }),
        })

        const failed = result.rejected.concat(result.pending).filter(Boolean)

        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // NOTE: Debuggin
      // console.debug('Session Callback ' + { session, token })

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      }
    },
    jwt: ({ token, user }) => {
      // NOTE: Debuggin
      // console.debug("JWT Callback", { token, user });

      if (user) {
        const $user = user as unknown as any

        return {
          ...token,
          id: $user.id,
          randomKey: $user.randomKey,
        }
      }

      return token
    },
    async signIn({ user, account, email }) {
      console.log(user.email)
      const userExists = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (userExists) {
        return true
      } else {
        return '/register'
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, metadata) => {
      console.error(code, metadata)
    },
    warn: (code) => {
      console.warn(code)
    },
    debug: (code, metadata) => {
      console.debug(code, metadata)
    },
  },
  //   Only for custom signin/login pages
  //   pages: {
  //     signIn: '/auth/signin',
  //   },
}
