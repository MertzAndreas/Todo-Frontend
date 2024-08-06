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

const CreateProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getToken } = useAuthContext();
    const [error, setError] = useState<string | null>(null);

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: createProjectDefaultFormValues,
    });

    const onSubmit = async (data: CreateProjectFormValues) => {
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/api/Project`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + (await getToken()),
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to create project');
            }

            await queryClient.invalidateQueries({ queryKey: ['projects'] });
            router.push('/Dashboard');
        } catch (e) {
            setError('Failed to create project. Please try again.');
            console.error(e);
        }
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
                        {error && <Box color="red.500">{error}</Box>}
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
