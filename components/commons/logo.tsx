import React from 'react'
import Image from "next/image";


export default function Logo() {
  return (
    <div className='w-52 border-r-1'>
      <Image
        className="dark:invert"
        src="/images/logo.png"
        alt="Next.js logo"
        width={100}
        height={28}
        priority
      />
      <span className="font-bold">Fatihoune Paie</span>
    </div>
  )
}
