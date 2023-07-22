'use client'
import {
    Button,
    IconButton,
    Box,
    Heading,
    Card,CardHeader, CardBody, CardFooter,
    Text,
    FormControl, FormLabel, FormErrorMessage, FormHelperText,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
  } from '@chakra-ui/react';
  import { ConnectWallet } from '@/components/ConnectWallet';
  import Contract from '../../public/Donation.json';
  import {createPublicClient, http, parseAbiItem } from 'viem';
  import { goerli, hardhat } from 'viem/chains';
  import { useState, useEffect } from 'react';
  import { useAccount } from 'wagmi';
  import FormAssociation from '@/components/FormAssociation';


const Associations = () => {

    const { isConnected, address : addressAccount } = useAccount();
    const [isRegister, setIsRegister] = useState(false);

    const checkAssociationRegister = () => {

    }

    // MOUNT
   useEffect( () => {
        const fetchData = async() => {
            const addr = await checkAssociationRegister()
        }
        fetchData()
    }, []);

    useEffect(() => {

    }, [addressAccount])

    return (
        <>
            <ConnectWallet/>
            { !isConnected && (
                <Heading textAlign="center" marginTop="70px">Please connect your wallet</Heading>
            )}

            { (isConnected && isRegister) && (
                'ok'
            )}

            { (isConnected && !isRegister) && (
                <>
                <FormAssociation addressAccount={addressAccount}/>
                </>

     
            )}

            

        </>
    )
}

export default Associations;