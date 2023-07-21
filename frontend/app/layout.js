'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import SideBar from '../components/SideBar';
import { ChakraProvider } from '@chakra-ui/react'


const inter = Inter({ subsets: ['latin'] })

import { WagmiConfig, createConfig, hardhat } from 'wagmi'
import { createPublicClient, http } from 'viem'
 
const config = createConfig({
  autoConnect: false,
  publicClient: createPublicClient({
    chain: hardhat,
    transport: http("localhost:3000")
  }),
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <WagmiConfig config={config}>
        <ChakraProvider>
          <SideBar>
            {children}
          </SideBar>
        </ChakraProvider>
      </WagmiConfig>
      
      </body>
    </html>
  )
}
