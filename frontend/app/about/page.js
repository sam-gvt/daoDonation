'use client'
import {
  Flex,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

const About = () => {
return (
    <>
    <Heading textAlign="center" marginTop="70px">Charity Bridge</Heading>
    <Flex>
        
        <Box w='60%' m='auto' pt='50px'>
            <Text textAlign='center'>
            CHARITYBRIDGE IS BASED ON A PUBLIC BLOCKCHAIN, OFFERING TOTAL TRANSPARENCY 
            AND IMMUTABILITY OF TRANSACTIONS. DONATIONS ARE MADE USING THE ETHEREUM CRYPTOCURRENCY. 
            EACH DONATION IS RECORDED AS A TRANSACTION ON 
            THE BLOCKCHAIN, ENABLING ALL PARTICIPANTS TO VERIFY THE FUNDS RECEIVED AND THEIR 
            SUBSEQUENT USE.
            </Text>
            <br></br> <br></br>
            <Text>
            THANKS TO BLOCKCHAIN TECHNOLOGY, ALL MOVEMENTS OF FUNDS IN THE DONATION DAO 
            ARE RECORDED AND PUBLICLY ACCESSIBLE. THIS ENABLES TOTAL TRANSPARENCY, AS EVERY DONOR 
            CAN CHECK HOW THE FUNDS HAVE BEEN USED. IN ADDITION, DONATION RECIPIENTS 
            ARE REQUIRED TO PROVIDE REGULAR REPORTS ON THE USE OF FUNDS, REINFORCING ACCOUNTABILITY 
            AND TRUST.
            </Text>
        </Box>
    </Flex>
    </>
)
}

export default About;