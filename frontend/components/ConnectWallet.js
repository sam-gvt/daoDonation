import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {
  Button,
  Flex,
  Box

} from '@chakra-ui/react';
export function ConnectWallet() {

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { disconnect } = useDisconnect()
 
  if (isConnected)
    return (
      <Flex justifyContent="space-between">
        <Box>Connected to {address}</Box>
        <Box>
          <Button colorScheme='red' onClick={() => disconnect()} >Disconnect</Button>
        </Box>
      </Flex>
    )
  return <Button colorScheme='blue' onClick={() => connect()}>Connect Wallet</Button>
}