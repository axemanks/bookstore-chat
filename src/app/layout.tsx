// layout.tsx will ba applied to all pages since it is in root.

import Chat from '../components/Chat'
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BookStore Chat',
  description: 'Chat with the BookStore AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <Providers>
        <body className={inter.className}>
          <Chat />
          {children}
        </body>
      </Providers>
    </html>
  )
}