'use client'
import {
  useToast,
  Button,
  Input,
  Flex,
  Box,
  Heading,
  Card,CardHeader, CardBody, CardFooter,
  Text,
  FormControl, FormLabel
} from '@chakra-ui/react';
import { ConnectWallet } from '@/components/ConnectWallet';
import Contract from '../../public/Donation.json';
import {createPublicClient, http, parseAbiItem } from 'viem';
import { goerli, hardhat } from 'viem/chains';
import { useState, useEffect } from 'react';
import {ArrowRightIcon, ArrowLeftIcon} from '@chakra-ui/icons'
import Session from '@/components/Session';
import { useAccount } from 'wagmi';
import { prepareWriteContract, writeContract } from '@wagmi/core';




const Admin = () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const { isConnected, address : addressAccount } = useAccount();
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminOnStandBy, setAdminOnStandby] = useState('')

    const toast = useToast();

  
    const client = createPublicClient({ 
      chain: goerli,
      transport: http()
    })
    const getIsAdmin = async () => {
        const data = await client.readContract({
          address: contractAddress,
          abi: Contract.abi,
          functionName: 'hasRole',
          args: ['0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775', addressAccount]
        })
    
        return data;
      }
    
    
      useEffect(() => {
        const fetchData = async() => {
          setIsAdmin(await getIsAdmin());
        }
        if(isConnected){
          fetchData();
        } else{
          setIsAdmin(undefined)
        }
        
      },[addressAccount, isAdmin])
      console.log(addressAccount);


  const [displayAdmin, setDisplayAdmin] = useState(false);
  const [SeeSession, setSeeSession] = useState(false);
  

  // --------- ASSOCIATIONS -------
  const [isLoading, setIsLoading] = useState(true);
  const [listAssociations, setListAssociations] = useState([])
  const [indexAssociationToDisplay, setIndexAssociationToDisplay] = useState(0)


  // get associations from contract
  const client2 = createPublicClient({ 
    chain: goerli,
    transport: http()
  })

  const fetchAssociations = async () => {
    const data = await client2.readContract({
      address: contractAddress,
      abi: Contract.abi,
      functionName: 'getAllAssociationsOnStandBy',
    })

    return data;
  }

  const addAdmin = async (_addr) => {
    try {
        
        const { request } = await prepareWriteContract({
            address: contractAddress,
            abi: Contract.abi,
            functionName: 'createSession',
            args: [_addr, 'admin'],

          })
        await writeContract(request)

        toast({
            title: 'Successful',
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
        })

    } catch (err){
        console.log(err);
        toast({
            title: 'Oops, an error has occurred !',
            status: 'error',
            duration: 3000,
            isClosable: true,
        })
}}


  const submitAdmin = (e) => {
    e.preventDefault()
    let address = e.target.address.value;
    addAdmin(address)
  }

  useEffect(() => {
    const fetchData = async() => {
      setListAssociations(await fetchAssociations());
      setIsLoading(false)
    }
    fetchData();
    const fetchData2 = async() => {
      setAdminOnStandby(await getAdminOnStandby());
    }
    fetchData2();
  },[])

  const nextImage = () => {
    setSeeSession(false)
    setIndexAssociationToDisplay(indexAssociationToDisplay + 1)
  }
  const previousImage = () => {
    setSeeSession(false)
    setIndexAssociationToDisplay(indexAssociationToDisplay - 1)
  }

  const seeSession = () => {
    setSeeSession(true);
  }


const getAdminOnStandby = async () => {
    const data = await client2.readContract({
      address: contractAddress,
      abi: Contract.abi,
      functionName: 'adminOnStandBy',
    })
    return data;
}

const voteSession = async (_addr, _vote) => {
  try {
      
      const { request } = await prepareWriteContract({
          address: contractAddress,
          abi: Contract.abi,
          functionName: 'vote',
          args: [_addr, _vote],

        })
      await writeContract(request)

      toast({
          title: 'Successful request',
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
      })
      setSeeSession(false)

  } catch (err){
      console.log(err);
      toast({
          title: 'Oops, an error has occurred !',
          status: 'error',
          duration: 3000,
          isClosable: true,
      })
}}

const yesVote = () => {
  voteSession(adminOnStandBy, true)
}
const noVote = () => {
  voteSession(adminOnStandBy, false)
}


if(isAdmin){
  return (

    <>

          <ConnectWallet/>

     
          <Heading textAlign="center" marginTop="70px">Admin, Validate association on standby</Heading>
          <Flex>
            <Box><Button onClick={() => setDisplayAdmin(!displayAdmin)}>
             {displayAdmin ? ('Association') : ('Admin')}
            </Button></Box>
          </Flex>

          {!displayAdmin && !isLoading && listAssociations.length > 0 && (
                <Box>
                <Card align='center' mt='20' h='80%'>
                <CardHeader>
                    <Heading size='md'> {listAssociations[indexAssociationToDisplay].name}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>Its activity : {listAssociations[indexAssociationToDisplay].activity}</Text>
                    <Text>Its Goal : {listAssociations[indexAssociationToDisplay].goal}</Text>
                    <Text>Its Localisation : {listAssociations[indexAssociationToDisplay].localisation}</Text>
                    <Text>Its OfficialWebsite : {listAssociations[indexAssociationToDisplay].officialWebsite}</Text>
                </CardBody>
                <CardFooter>

                    { (indexAssociationToDisplay > 0) && (
                    <Button colorScheme='blue' mr='4' onClick={previousImage}>
                    <ArrowLeftIcon />
                    <Text pl='3'>previous</Text>
                    </Button> )}

                    <Button colorScheme='blue' mr='4' onClick={seeSession}>
                    <Text pl='3'>See Session</Text>
                    </Button>

                    { (indexAssociationToDisplay < listAssociations.length-1) && (
                    <Button colorScheme='blue' ml='4' onClick={nextImage}>
                    <Text pr='5'>next</Text>
                    <ArrowRightIcon />
                    </Button>
                    )}
                    
                </CardFooter>
                </Card>

                {SeeSession && (
                    <Session listAssociations={listAssociations} setSeeSession={setSeeSession} indexAssociationToDisplay={indexAssociationToDisplay}/>
                )}
      
            </Box>

            
                )}
            { !displayAdmin && !isLoading && listAssociations.length == 0 && (
                <Box>
            <Card align='center' mt='20' h='80%'>
                <CardHeader>
                <Heading size='md'> There are no associations yet </Heading>
                </CardHeader>
                <CardBody>
                </CardBody>
                <CardFooter>
                </CardFooter>
                </Card>
                </Box>
            )}
            { isLoading && (
                <Heading textAlign="center" marginTop="70px">Loading ...</Heading>
            )}
          {(displayAdmin && adminOnStandBy.length > 0) && (
            <>
              <Box w='70%' m='auto' mt='100px'>
                <Box>
                  <Text>Voting session for : {adminOnStandBy}</Text>
                </Box>
                <Box>
                  <Button colorScheme='green' onClick={yesVote} mr='10px'>Yes</Button>
                  <Button colorScheme='red' onClick={noVote}>No</Button> 
                </Box>
                </Box>
          
                 
            </>
            
          )}
          {(displayAdmin && adminOnStandBy.length == 0) && (
            <>
              <form onSubmit={submitAdmin}>
                <FormControl isRequired w='70%' m='auto' pt='50px'>
                    <FormLabel>Address</FormLabel>
                    <Input id='address' name='address'/>
                    <Button colorScheme='green' type='submit'>Start session Vote</Button>    
                </FormControl>
              </form>
            </>
            )}
           


    </>


  )}
  else {
    return (
      <>

      <ConnectWallet/>

 
      <Heading textAlign="center" marginTop="70px">You are not admin</Heading>
      </>
    )
  }
}

export default Admin;