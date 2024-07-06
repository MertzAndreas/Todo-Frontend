"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToken } from "@/hooks/useToken";
import {getUserIdFromToken} from "@/utils/isTokenExpired";
import {useQueryClient} from "@tanstack/react-query";
import {Box, Button, Flex, Heading, Input, Textarea} from "@chakra-ui/react";

type CreateProject = {
    name: string;
    description: string;
    creatorId: string
}

const Login = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getToken } = useToken("Account/Login");
    const [form, setForm] = useState<CreateProject>(() => {
        const id = getUserIdFromToken();
        if (!id) {
            console.log("Invalid token");
            router.push('/Account/Login');
        }
        return {
            name: '',
            description: '',
            creatorId: id || ''
        };
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(form.creatorId === null){
                throw new Error("Invalid token");
            }

            setForm({...form, creatorId: form.creatorId});
            const res = await fetch('http://localhost:5040/api/Project', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getToken()
                },
                body: JSON.stringify(form),
            });

            if(!res.ok){
                throw new Error("Failed to create project");
            }

            await queryClient.invalidateQueries({queryKey: ['projects']});
            router.push('/Dashboard');
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100vh" bg="gray.200">
            <Heading variant="basic">Create Project</Heading>
            <Box as="form" onSubmit={handleSubmit} width="60%" p={8} bg="white" borderRadius="lg" shadow="lg" display="flex" flexDirection="column" gap={4}>
                <Input
                    type="text"
                    name="projectName"
                    placeholder="Cool Project Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    variant={"basic"}
                />
                <Textarea
                    name="description"
                    placeholder="Project Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    variant={"basic"}
                />
                <Button
                    type="submit"
                    variant="blueButton"
                >
                    Create Project
                </Button>
            </Box>
            <Link href="/Dashboard">
                <Button
                    variant="greyButton"
                >
                    Go Back
                </Button>
            </Link>
        </Flex>
    );
};

export default Login;
