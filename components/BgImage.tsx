'use client'

import { Image } from '@chakra-ui/react'

interface Params {
  url: string
  alt: string
}

export const BgImage = ({ url, alt }: Params) => {
  return (
    <section>
      <Image
        className="absolute w-full h-[calc(100vh-88px)] object-cover"
        src={url}
        alt={alt}
      />
      <div className="absolute w-full h-[calc(100vh-88px)] bg-[black]/75" />
    </section>
  )
}
