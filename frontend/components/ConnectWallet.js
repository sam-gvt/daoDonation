import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import {
  Button,
  Flex,
  Box,
  Text

} from '@chakra-ui/react';

import { InjectedConnector } from '@wagmi/core/connectors/injected'
import {createPublicClient, http, formatEther } from 'viem';
import { goerli, hardhat } from 'viem/chains';
import { useEffect, useState } from 'react';




export function ConnectWallet() {
  const { address, isConnected } = useAccount()

  const [data, setData] = useState(undefined)
  const { connect, isConnecting } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const client = createPublicClient({ 
    chain: goerli,
    transport: http()
})

useEffect(() => {
  const data = async () => {
    const value = await client.getBalance({ 
      address: address,
    })
    setData(formatEther(value) )
  } 
  data()
}, [address])


 
  if (isConnected)
    return (
      <Flex justifyContent="space-between">
        <Box>
        <Text>Connected to {address}</Text>
        <Text>Balance: {data ? data: "Loading..."} ethers</Text>
        
        </Box>
        <Box>
          <Button colorScheme='red' onClick={() => disconnect()} >Disconnect</Button>
        </Box>
      </Flex>
    )
  if (isConnecting) {
      return (
        <Flex d-flex justify-content-center align-items-center vh-100>
          <Text>Connecting...</Text>
        </Flex>
      )
    }
  return <Flex justifyContent="flex-end"><Button colorScheme='blue' onClick={() => connect()}>Connect Wallet</Button></Flex>

}