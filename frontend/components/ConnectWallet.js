import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import {
  Button,
  Flex,
  Box,
  Text

} from '@chakra-ui/react';

import { InjectedConnector } from '@wagmi/core/connectors/injected'
import {createPublicClient, http } from 'viem';
import { goerli, hardhat } from 'viem/chains';




export async function ConnectWallet() {
  const { address, isConnected } = useAccount()

  const { connect, isConnecting } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const client = createPublicClient({ 
    chain: goerli,
    transport: http()
})

  const data = await client.getBalance({ 
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  })

  console.log(data);
 
  if (isConnected)
    return (
      <Flex justifyContent="space-between">
        <Box>
        <Text>Connected to {address}</Text>
        <Text>Balance: {data ? data.formatted : "Loading..."} ethers</Text>
        
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