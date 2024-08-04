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

export type LoginForm = {
    email: string;
    password: string;
};

const Login = () => {
    const { isAuthenticated, login, redirectToDashboardIfAuthenticated } = useAuthContext();
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    useEffect(() => {
        redirectToDashboardIfAuthenticated();
    }, [isAuthenticated, redirectToDashboardIfAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(form);
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={'auto'}
            width={'100%'}
        >
            <Card
                as="form"
                onSubmit={handleSubmit}
                width="60%"
                align={'center'}
                p={4}
                borderRadius="lg"
                shadow="lg"
            >
                <CardHeader>
                    <Heading>Login to your Account</Heading>
                </CardHeader>
                <CardBody width={'80%'}>
                    <Stack spacing={4}>
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
                    </Stack>
                </CardBody>

                <CardFooter justifyContent="space-evenly">
                    <ButtonGroup spacing={'5'}>
                        <Button type="submit">Login</Button>
                        <Link href="/Account/Register">
                            <Button variant={'outline'}>Sign Up</Button>
                        </Link>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </Flex>
    );
};

export default Login;
