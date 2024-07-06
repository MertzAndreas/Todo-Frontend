"use client"
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useToken } from '@/hooks/useToken';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import {login} from "@/app/Account/Login/login";
import {Box, Button, Flex, Heading, Input} from "@chakra-ui/react";

export type LoginForm = {
    email: string;
    password: string;
};

const Login = () => {
    const router = useRouter();
    const { validateAndRefreshToken } = useToken(undefined, '/chat');
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    const { mutate, error } = useMutation( {
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.accessToken);
            router.push('/chat');
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
    });

    useEffect(() => {
        validateAndRefreshToken();
    }, [validateAndRefreshToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        mutate({ ...form});
    };

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100vh" bg="gray.200">
            <Heading as="h1" size="2xl" mb={6}>Login to your Account</Heading>
            <Box as="form" onSubmit={handleSubmit} width="60%" p={8} bg="white" borderRadius="lg" shadow="lg" display="flex" flexDirection="column" gap={4}>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    p={2}
                    border="1px"
                    borderRadius="md"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    p={2}
                    border="1px"
                    borderRadius="md"
                />
                <Button
                    type="submit"
                    p={2}
                    bg="blue.500"
                    color="white"
                    borderRadius="md"
                    _hover={{ bg: "blue.600" }}
                    transition="background-color 0.2s"
                >
                    Login
                </Button>
            </Box>
            <Link href="/Account/Register">
                <Button mt={4} p={2} bg="gray.400" color="white" borderRadius="md" _hover={{ bg: "blue.600" }} transition="background-color 0.2s">
                    Sign Up
                </Button>
            </Link>
        </Flex>
    );
};

export default Login;
