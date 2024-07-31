"use client";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useQueryClient} from "@tanstack/react-query";
import {Box, Button, Flex, Heading, Input, Textarea} from "@chakra-ui/react";
import useAuthContext from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoutes";
import {BASE_URL} from "@/utils/globals";
import useHubConnection from "@/hooks/signalR/useSignalR";

type CreateProjectProps = {
    name: string;
    description: string;
};

const CreateProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const {getToken} = useAuthContext();
    const [form, setForm] = useState<CreateProjectProps>(() => {
        return {
            name: "",
            description: "",
        };
    });
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/api/Project`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + (await getToken()),
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error("Failed to create project");
            }

            await queryClient.invalidateQueries({queryKey: ["projects"]});
            router.push("/Dashboard");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Heading as="h1" mb={2}>
                Create Project
            </Heading>
            <Box
                as="form"
                onSubmit={handleSubmit}
                width="60%"
                p={8}
                bg="white"
                borderRadius="lg"
                shadow="lg"
                display="flex"
                flexDirection="column"
                gap={4}
            >
                <Input
                    type="text"
                    placeholder="Cool Project Name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    p={2}
                />
                <Textarea
                    placeholder="Project Description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />
                <Flex justifyContent="space-evenly">
                    <Button type="submit">
                        Create Project
                    </Button>
                    <Link href="/Dashboard">
                        <Button variant={"outline"}>Go Back</Button>
                    </Link>
                </Flex>
                
            </Box>
            
        </Flex>
    );
};

const ProtectedCreateProject = ProtectedRoute(CreateProject);

export default ProtectedCreateProject;
