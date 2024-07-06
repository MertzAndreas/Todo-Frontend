"use client"
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useToken} from "@/hooks/useToken";
import {useMutation} from "@tanstack/react-query";
import {register} from "@/app/Account/Register/register";
import {Box, Button, Flex, Heading, Input} from "@chakra-ui/react";

export type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const { validateAndRefreshToken } = useToken('','/chat');
    const router = useRouter();
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { mutate } = useMutation( {
        mutationFn: register,
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
        setForm({...form, [e.target.name]: e.target.value});
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        mutate({...form})
    }

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100vh" bg="gray.200">
            <Heading as="h1" size="2xl" mb={6}>Register Account</Heading>
            <Box as="form" onSubmit={handleSubmit} width="60%" p={8} bg="white" borderRadius="lg" shadow="lg" display="flex" flexDirection="column" gap={4}>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    variant="basic"
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    variant="basic"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    variant="basic"
                />
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    variant="basic"
                />
                <Button
                    type="submit"
                    variant="blueButton"
                >
                    Register
                </Button>
            </Box>
            <Link href="/Account/Login">
                <Button variant="blueButton">
                    Already have an account
                </Button>
            </Link>
        </Flex>
    );
};

export default Register;
