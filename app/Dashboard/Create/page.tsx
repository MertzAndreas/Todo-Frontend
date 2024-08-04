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
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoutes';
import { BASE_URL } from '@/utils/globals';

type CreateProjectProps = {
    name: string;
    description: string;
};

const CreateProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getToken } = useAuthContext();
    const [form, setForm] = useState<CreateProjectProps>({ name: '', description: '' });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/api/Project`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + (await getToken()),
                },
                body: JSON.stringify(form),
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
            <Card as="form" onSubmit={handleSubmit} width="60%" p={8} borderRadius="lg" shadow="lg">
                <CardHeader>
                    <Heading as="h1">Create Project</Heading>
                </CardHeader>
                <CardBody>
                    <Stack gap={4}>
                        <Input
                            type="text"
                            placeholder="Cool Project Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            p={2}
                        />
                        <Textarea
                            placeholder="Project Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        {error && <Box color="red.500">{error}</Box>}
                    </Stack>
                </CardBody>
                <CardFooter>
                    <ButtonGroup gap={4}>
                        <Button type="submit">Create Project</Button>
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
