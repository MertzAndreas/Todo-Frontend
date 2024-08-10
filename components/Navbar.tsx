'use client';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon, MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import useAuthContext from '@/providers/AuthProvider';
import { getUserNameFromToken } from '@/utils/token';
import React, { useEffect, useState } from 'react';

const Links = [{ name: 'Dashboard', link: '/Dashboard' }];
const toastOptions = {
    success: {
        title: 'Logout Successful',
    },
    error: (error: Error) => ({
        title: 'Logout Failed',
        description: error.message || 'An error occurred during logout',
    }),
    loading: {
        title: 'Loading...',
    },
};

export default function Navbar() {
    const [username, setUsername] = useState('');
    const toast = useToast();
    const { toggleColorMode, colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { logOut, isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (isAuthenticated) {
            setUsername(getUserNameFromToken());
        } else {
            setUsername('');
        }
    }, [isAuthenticated]);

    const onLogout = async () => {
        const logoutPromise = logOut();
        toast.promise(logoutPromise, toastOptions);
    };

    return (
        <>
            <Box bg={useColorModeValue('gray.200', 'gray.1000')} px={5}>
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
                    <Flex alignItems={'center'} gap={4}>
                        <IconButton
                            aria-label={'Switch theme'}
                            icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
                            variant={'ghost'}
                            onClick={toggleColorMode}
                            size={'lg'}
                        />
                        <Menu>
                            {username ? (
                                <MenuButton>
                                    <Avatar size={'md'} name={username} />
                                </MenuButton>
                            ) : (
                                <MenuButton
                                    as={IconButton}
                                    rounded={'full'}
                                    icon={<SettingsIcon />}
                                    cursor={'pointer'}
                                    size={'lg'}
                                    variant={'ghost'}
                                />
                            )}
                            <MenuList>
                                <MenuItem>Account</MenuItem>
                                <MenuItem onClick={onLogout}>Log-out</MenuItem>
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
    return <Button variant={'ghost'}>{children}</Button>;
};
