'use client'
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Heading,
  } from '@chakra-ui/react'
import {createPublicClient, http, parseAbiItem } from 'viem';
import { goerli, hardhat } from 'viem/chains';
import { useState, useEffect } from 'react';
import { ConnectWallet } from '@/components/ConnectWallet';





const MyDonation = () => {


    const [isLoading, setIsLoading] = useState(true)
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const [myDonations, setMyDonations] = useState([]);

    
    const client = createPublicClient({ 
        chain: goerli,
        transport: http()
    })

     // Get all the events
     const getEvents = async() => {
        // get all the deposit events 
        const donationsLogs = await client.getLogs({
            event: parseAbiItem('event DonationToAssociation(address donor, address addrAssociation, uint mount)'),
            fromBlock: 0n,
            toBlock: 'latest' // Pas besoin valeur par défaut
            
        })
        console.log('logs : ',donationsLogs)
        // setMyDonations(donationsLogs.map(
        //     log => ({
        //         address: log.args.voterAddress
        //     })
        // ))

    }

    useEffect(() => {
        const fetchData = async() => {
          await getEvents()
          setIsLoading(false)
        }
        fetchData();
      },[])

    return (
        <>
            <ConnectWallet/>

            { isLoading ? (
                
                <Heading textAlign="center" marginTop="70px"> Loading ...</Heading>

            ) : (
                <>
                <Heading textAlign="center" marginTop="70px">My Donations</Heading>

                <List spacing={3}>
                    <ListItem>
                        <ListIcon  color='green.500' />
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit
                    </ListItem>
                    <ListItem>
                        <ListIcon  color='green.500' />
                        Assumenda, quia temporibus eveniet a libero incidunt suscipit
                    </ListItem>
                    <ListItem>
                        <ListIcon  color='green.500' />
                        Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                    </ListItem>
                </List>
                </>
            )}
            
        </>
        
     );
}
 
export default MyDonation;