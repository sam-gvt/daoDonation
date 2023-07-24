'use client'
import React  from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,

} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiMenu,
  FiSettings
} from 'react-icons/fi';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import {createPublicClient, http } from 'viem';
import {useState, useEffect} from 'react'
import { goerli, hardhat } from 'viem/chains';
import Contract from '../public/Donation.json';





const LinkItems = [
  { name: 'Make Donation', icon: FiHome, url: '/' },
  { name: 'Associations', icon: FiTrendingUp, url: '/associations' },
  { name: 'My Donations', icon: FiTrendingUp, url: '/myDonations' },
  { name: 'About us', icon: FiCompass, url: '/about' },
];

export default function SimpleSidebar({ children }) {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isConnected, address : addressAccount } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

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
    } else {
      setIsAdmin(undefined)
    }
    
  },[addressAccount])



  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        { isAdmin && (
          <Link href='admin' style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <IconButton aria-label='Search database' icon={<FiSettings />} />
          </Link>
        )}
        {children}
      </Box>
    </Box>
  );
}



const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        CharityBridge
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url}>
          {link.name}
        </NavItem>
      ))}
   
    </Box>
  );
};


const NavItem = ({ icon, url, children, ...rest }) => {
  return (
    <Link href={url} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};



const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        CharityBridge
      </Text>
    </Flex>
  );
};

