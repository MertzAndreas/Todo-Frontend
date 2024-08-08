'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
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
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoutes';
import { BASE_URL } from '@/utils/globals';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    createProjectFormSchema,
    CreateProjectFormValues,
    createProjectDefaultFormValues,
} from '@/app/Dashboard/Create/createProjectFormSchema';
import createProjectRequest from '@/api/createProject';

const toastOptions = {
    success: {
        title: 'Project was created successfully',
    },
    error: (error: Error) => ({
        title: 'Error during project creation',
        description: error.message || 'An unexpected error occurred during project creation.',
    }),
    loading: {
        title: 'Loading...',
    },
};
const CreateProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getToken } = useAuthContext();
    const toast = useToast();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: createProjectDefaultFormValues,
    });

    const onSubmit = async (data: CreateProjectFormValues) => {
        const resPromise = createProjectRequest(data, getToken);
        toast.promise(resPromise, toastOptions);
        await queryClient.invalidateQueries({ queryKey: ['projects'] });
        const id = await resPromise;
        router.push(`/Dashboard/${id}`);
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
                onSubmit={handleSubmit(onSubmit)}
                width="60%"
                p={8}
                borderRadius="lg"
                shadow="lg"
            >
                <CardHeader>
                    <Heading as="h1">Create Project</Heading>
                </CardHeader>
                <CardBody>
                    <Stack gap={4}>
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel>Project Name</FormLabel>
                            <Input
                                type="text"
                                placeholder="Cool Project Name"
                                {...register('name')}
                                p={2}
                            />
                            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.description}>
                            <FormLabel>Project Description</FormLabel>
                            <Textarea
                                placeholder="Project Description"
                                {...register('description')}
                            />
                            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                        </FormControl>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <ButtonGroup gap={4}>
                        <Button type="submit" isLoading={isSubmitting}>
                            Create Project
                        </Button>
                        <Link href="/Dashboard">
                            <Button variant="outline">Go Back</Button>
                        </Link>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </Flex>
    );
};

const ProtectedCreateProject = ProtectedRoute(CreateProject);

export default ProtectedCreateProject;
