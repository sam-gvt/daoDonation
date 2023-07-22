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
import Contract from '../public/Donation.json';
import {createPublicClient, http, parseAbiItem } from 'viem';
import { goerli, hardhat } from 'viem/chains';
import { useState, useEffect } from 'react';
import {ArrowRightIcon, ArrowLeftIcon} from '@chakra-ui/icons'



export default function Home() {

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // --------- ASSOCIATIONS -------
  const [isLoading, setIsLoading] = useState(true);
  const [listAssociations, setListAssociations] = useState([])
  const [indexAssociationToDisplay, setIndexAssociationToDisplay] = useState(0)

  const [displayDonate, setDisplayDonate] = useState(false)


  // get associations from contract
  const client = createPublicClient({ 
    chain: hardhat,
    transport: http()
  })

  const fetchAssociations = async () => {
    const data = await client.readContract({
      address: contractAddress,
      abi: Contract.abi,
      functionName: 'getAssociationsAtInterval',
      // the first 20
      args: [0, 20]
    })

    return data;
  }
  
  
  useEffect(() => {
    const fetchData = async() => {
      setListAssociations(await fetchAssociations());
      setIsLoading(false)
    }
    fetchData();
  },[])

  const nextImage = () => {
    setDisplayDonate(false)
    setIndexAssociationToDisplay(indexAssociationToDisplay + 1)
  }
  const previousImage = () => {
    setDisplayDonate(false)
    setIndexAssociationToDisplay(indexAssociationToDisplay - 1)
  }

  const buttonDisplayDonate = () => {
    console.log('ok');
    setDisplayDonate(true)
  }

  const donate = (e) => {
    e.preventDefault()
    let amount = e.target.amount.value
    sendDonation(amount)
    
  }

  const sendDonation = async (address) => {

    try {
        const { request } = await prepareWriteContract({
            address: contractAddress,        
            abi: Contract.abi,
            functionName: 'addVoter',
            args: [address],
        });
        await writeContract(request)

        toast({
            title: 'Voter adds with success',
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
        })
        setNewAddressVoterAdd(address);

    } catch {
        toast({
            title: 'Oops, an error has occurred !',
            description: 'Check in the list that the address does not already exist',
            status: 'error',
            duration: 3000,
            isClosable: true,
        })
        
    }
    
}
console.log(listAssociations);
  
  return (

    <>
          <ConnectWallet/>
          
          <Heading textAlign="center" marginTop="70px">Make a donation</Heading>
          { !isLoading && listAssociations.length > 0 && (
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

                <Button colorScheme='blue' onClick={buttonDisplayDonate}>Donate</Button>

                { (indexAssociationToDisplay < listAssociations.length-1) && (
                <Button colorScheme='blue' ml='4' onClick={nextImage}>
                  <Text pr='5'>next</Text>
                  <ArrowRightIcon />
                </Button>
                )}
                
              </CardFooter>
            </Card>
          </Box>
            )}
          { !isLoading && listAssociations.length == 0 && (
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
    

          { displayDonate && (
            <form onSubmit={donate}>
              <FormControl pt='10' w='70%' m='auto'>
                <FormLabel fontSize='2xl'>Amount</FormLabel>
                <NumberInput min={1} borderColor='black'>
                  <NumberInputField id='amount' name='amount'/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button type='submit'>Donate</Button>
              </FormControl>
            </form>
            
          )}
          
          

    </>


  )
  
        }