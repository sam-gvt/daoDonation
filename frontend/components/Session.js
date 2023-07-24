'use client'
import {
  Button,
  useToast,
  Input,
  Flex,
  Box,
  Heading,
  Card,CardHeader, CardBody, CardFooter,
  Text,
  FormControl, FormLabel
} from '@chakra-ui/react';
import { ConnectWallet } from '@/components/ConnectWallet';
import Contract from '../public/Donation.json';
import {createPublicClient, http, parseAbiItem } from 'viem';
import { goerli, hardhat } from 'viem/chains';
import { useState, useEffect } from 'react';
import { prepareWriteContract, writeContract } from '@wagmi/core';

const Session = ({listAssociations, indexAssociationToDisplay, setSeeSession}) => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const [isLoading, setIsLoading] = useState(true);
    const [infosSession, setInfosSessions] = useState([])
    const toast = useToast();


    const client = createPublicClient({ 
        chain: hardhat,
        transport: http()
    })

    let addressSession = listAssociations[indexAssociationToDisplay].addr
    console.log(listAssociations[indexAssociationToDisplay].addr);
    const fetchSession = async () => {
        const data = await client.readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: 'sessions',
        args: [addressSession]
        })

        return data;
    }

    useEffect(() => {
        const fetchData = async() => {
          setInfosSessions(await fetchSession());
          setIsLoading(false)
        }
        fetchData();
    },[])
    
    
    const startVoteSession = async (_addr, _name) => {
        try {
            
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: 'createSession',
                args: [_addr, _name],

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


    const startVote = () => {
        startVoteSession(listAssociations[indexAssociationToDisplay].addr, 'association')
    }
    const yesVote = () => {
        voteSession(listAssociations[indexAssociationToDisplay].addr, true)
    }
    const noVote = () => {
        voteSession(listAssociations[indexAssociationToDisplay].addr, false)
    }
    console.log(infosSession);

    return ( 
        <Flex>
            {isLoading && (
                <Heading textAlign="center" marginTop="70px">Loading ...</Heading>
            )}
            {!isLoading && (
                infosSession[0] === '' ? (
                    <Button colorScheme='green' onClick={startVote}>Start session Vote</Button>
                ) : (
                    <>
                    <Button colorScheme='green' onClick={yesVote}>Yes</Button>
                    <Button colorScheme='red' onClick={noVote}>No</Button>   
                    </>
   
                )
                )}
         
        </Flex>
     );
}
 
export default Session;