'use client';
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useColorModeValue,
    Stack,
    Divider,
    useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import useAuthContext from '@/providers/AuthProvider';
import { getUserNameFromToken } from '@/utils/token';
import React, { useEffect, useState } from 'react';

const Links = [{ name: 'Dashboard', link: '/Dashboard' }];

export default function Navbar() {
    const [username, setUsername] = useState('');
    const { toggleColorMode, colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { logOut } = useAuthContext();

    useEffect(() => {
        setUsername(getUserNameFromToken());
    }, []);

    return (
        <>
            <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>Logo</Box>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {Links.map(({ name, link }) => (
                                <NavLink key={link}>
                                    <Link href={link}>{name}</Link>
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <Avatar name={username} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Account</MenuItem>
                                <MenuItem onClick={logOut}>Log-out</MenuItem>
                                <Divider />
                                <MenuItem onClick={toggleColorMode}>Theme {colorMode}</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map(({ link, name }) => (
                                <NavLink key={link}>
                                    <Link href={link}>{name}</Link>
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}

const NavLink = ({ children }: React.PropsWithChildren) => {
    return (
        <Box
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
        >
            {children}
        </Box>
    );
};
