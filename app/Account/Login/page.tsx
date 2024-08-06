'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Stack,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    loginFormDefaultValues,
    loginFormSchema,
    LoginFormValues,
} from '@/app/Account/Login/loginFormSchema';

const Login = () => {
    const { isAuthenticated, login, redirectToDashboardIfAuthenticated } = useAuthContext();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: loginFormDefaultValues,
    });

    useEffect(() => {
        redirectToDashboardIfAuthenticated();
    }, [isAuthenticated, redirectToDashboardIfAuthenticated]);

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
                onSubmit={handleSubmit(login)}
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
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                {...register('email')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                            />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                {...register('password')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                            />
                            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                        </FormControl>
                    </Stack>
                </CardBody>

                <CardFooter justifyContent="space-evenly">
                    <ButtonGroup spacing={'5'}>
                        <Button type="submit" isLoading={isSubmitting}>
                            Login
                        </Button>
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
