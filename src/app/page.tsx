import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

// this will hold the main site content
export default function Home() {
  return (    
    <main className='absolute inset-0 flex justify-center items-center'>
      <Link href='/dashboard'>
        <button className='absolute top-5 right-5 p-2 rounded bg-blue-500 text-white'>
          Settings
        </button>
      </Link>
      Website content
    </main>
  )
}