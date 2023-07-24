'use client'
import {
  Button,
  useToast,
  Input,
  IconButton,
  Box,
  Heading,
  Card,CardHeader, CardBody, CardFooter,
  Text,
  FormControl, FormLabel, FormErrorMessage, FormHelperText,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import Contract from '../public/Donation.json'


const FormAssociation = ({addressAccount, isRegister}) => {
    
    const toast = useToast();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    const register = async (_name, _activity, _goal, _localisation, _website) => {
        try {
            
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: 'registerNewAssociation',
                args: [addressAccount, _name, _activity, _goal, _localisation, _website],

              })
            await writeContract(request)

            toast({
                title: 'Successful request',
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

        const setForm = async (_name, _activity, _goal, _localisation, _website) => {
            try {
                
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: 'setAssociationForm',
                    args: [_name, _activity, _goal, _localisation, _website],
    
                  })
                await writeContract(request)
    
                toast({
                    title: 'Successful request',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(
            e.target.name.value,
            e.target.activity.value,
            e.target.goal.value,
            e.target.localisation.value,
            e.target.website.value,
        );

        if(isRegister) {
            setForm(e.target.name.value,
                e.target.activity.value,
                e.target.goal.value,
                e.target.localisation.value,
                e.target.website.value,)
        } else {
            register(
                e.target.name.value,
                e.target.activity.value,
                e.target.goal.value,
                e.target.localisation.value,
                e.target.website.value,
            )
        }
 
    }
    
    return (
        <>
        <Heading textAlign="center" marginTop="70px">
        { !isRegister ? (
            'Association registration request'
        ) : (
            'Association, set Form'
        )}
        </Heading>

        <form onSubmit={handleSubmit}>
        <FormControl isRequired w='70%' m='auto' pt='50px'>
            <FormLabel>Name</FormLabel>
            <Input id='name' name='name'/>
            <FormLabel>Activity</FormLabel>
            <Input id='activity' name='activity'/>
            <FormLabel>Goal</FormLabel>
            <Input id='goal' name='goal'/>
            <FormLabel>Localisation</FormLabel>
            <Input id='localisation' name='localisation'/>
            <FormLabel>Official Website</FormLabel>
            <Input id='website' name='website'/>

            <Button colorScheme='blue' type='submit' mt='30px'>Send Request</Button>
        </FormControl>
        </form>
        </>
     );

}
export default FormAssociation;