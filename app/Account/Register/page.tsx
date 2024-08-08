// app/Account/Register/page.tsx
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
    useToast,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    registerFormDefaultValues,
    registerFormSchema,
    RegisterFormValues,
} from '@/app/Account/Register/registerFormSchema';

const toastOptions = {
    success: {
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
    },
    error: (error: Error) => ({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration. Please try again.',
    }),
    loading: {
        title: 'Registering...',
        description: 'Please wait while we create your account.',
    },
};

const Register = () => {
    const { isAuthenticated, register, redirectToDashboardIfAuthenticated } = useAuthContext();
    const toast = useToast();
    const {
        handleSubmit,
        register: formRegister,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: registerFormDefaultValues,
    });

    useEffect(() => {
        redirectToDashboardIfAuthenticated();
    }, [isAuthenticated, redirectToDashboardIfAuthenticated]);

    const onSubmit = async (form: RegisterFormValues) => {
        const registerPromise = register(form);
        toast.promise(registerPromise, toastOptions);
    };

    return (
        <Flex flexDirection="column" alignItems="center" m={'auto'} width={'100%'}>
            <Card
                align={'center'}
                as="form"
                onSubmit={handleSubmit(onSubmit)}
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
                        <FormControl isInvalid={!!errors.username}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="Username"
                                {...formRegister('username')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                                autoComplete={'username'}
                            />
                            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="Email"
                                {...formRegister('email')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                                autoComplete={'email'}
                            />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Password"
                                {...formRegister('password')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                                autoComplete={'new-password'}
                            />
                            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...formRegister('confirmPassword')}
                                p={2}
                                border="1px"
                                borderRadius="md"
                                autoComplete={'new-password'}
                            />
                            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                        </FormControl>
                    </Stack>
                </CardBody>
                <CardFooter justifyContent="space-evenly">
                    <ButtonGroup spacing={'5'}>
                        <Button type="submit" isLoading={isSubmitting}>
                            Register
                        </Button>
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
