'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import SideBar from '../components/SideBar';
import { ChakraProvider } from '@chakra-ui/react'


const inter = Inter({ subsets: ['latin'] })

import { WagmiConfig, createConfig } from 'wagmi'
import { hardhat, goerli } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'



import { configureChains } from '@wagmi/core'
 
const API_KEY_INFURA = process.env.API_KEY_INFURA;

const { chains, publicClient } = configureChains(
  [goerli],
  [
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: "http://127.0.0.1:8545"
    //   }),
    // }),
    //publicProvider(),
    infuraProvider({ apiKey: API_KEY_INFURA })
    
  ]
);
const config = createConfig({
  autoConnect: false,
  publicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    })
  ]
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
