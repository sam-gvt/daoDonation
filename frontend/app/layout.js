'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import SideBar from '../components/SideBar';
import { ChakraProvider } from '@chakra-ui/react'


const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ChakraProvider>
        <SideBar>
          {children}
        </SideBar>
      </ChakraProvider>
      
      </body>
    </html>
  )
}
