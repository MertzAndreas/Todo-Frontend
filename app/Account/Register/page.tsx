'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Input,
    Stack,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';

export type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const { isAuthenticated, register, redirectToDashboardIfAuthenticated } = useAuthContext();
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        redirectToDashboardIfAuthenticated();
    }, [isAuthenticated, redirectToDashboardIfAuthenticated]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        register(form);
    }

    return (
        <Flex flexDirection="column" alignItems="center" m={'auto'} width={'100%'}>
            <Card
                align={'center'}
                as="form"
                onSubmit={handleSubmit}
                width="60%"
                p={8}
                borderRadius="lg"
                shadow="lg"
                gap={4}
            >
                <CardHeader>
                    <Heading as="h1" size="2xl">
                        Register Account
                    </Heading>
                </CardHeader>
                <CardBody width={'80%'}>
                    <Stack spacing={4}>
                        <Input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            p={2}
                            border="1px"
                            borderRadius="md"
                        />
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
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            p={2}
                            border="1px"
                            borderRadius="md"
                        />
                    </Stack>
                </CardBody>
                <CardFooter justifyContent="space-evenly">
                    <ButtonGroup spacing={'5'}>
                        <Button type="submit">Register</Button>
                        <Link href="/Account/Login">
                            <Button variant={'outline'}>Already have an account</Button>
                        </Link>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </Flex>
    );
};

export default Register;
