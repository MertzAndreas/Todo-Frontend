"use client"
import React, { useEffect } from 'react';
import { useToken } from "@/hooks/useToken";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react";

interface Project {
    projectId: number;
    name: string;
    description: string;
    creatorName: string;
    teamSize: number;
}

const fetchProjects = async (getToken: () => Promise<string>) => {
    const response = await fetch('http://localhost:5040/api/Project/get_projects', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getToken()
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }

    return response.json();
};

const deleteProject = async ({ projectId, getToken }: { projectId: number; getToken: () => Promise<string> }) => {
    const response = await fetch(`http://localhost:5040/api/Project/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getToken()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete project');
    }

    return projectId;
};

const Page = () => {
    const { validateAndRefreshToken, getToken } = useToken('/Account/Login');
    const queryClient = useQueryClient();

    const { data: projects = [], isLoading, error } = useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: () => fetchProjects(getToken),
        staleTime: 1000 * 60 * 2
    });

    const {mutate} = useMutation({
        mutationFn: deleteProject,
        onSuccess: (deletedProjectId) => {
            queryClient.setQueryData<Project[]>(
                ['projects'],
                (oldProjects) =>
                    oldProjects?.filter((project) => project.projectId !== deletedProjectId)
            );
        },
        onError: (error) => {
            console.error(error);
        }
    });

    useEffect(() => {
        validateAndRefreshToken();
    }, [validateAndRefreshToken]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading projects</p>;

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" bg="gray.200">
            {projects.length > 0 ? (
                projects.map((project) => (
                    <Box key={project.projectId} bg="white" p={6} mb={4} borderRadius="lg" shadow="md" width="60%">
                        <Heading as="h2" mb={2}>{project.name}</Heading>
                        <Text mb={2} color="gray.700">{project.description}</Text>
                        <Text mb={1} color="gray.500">Created by: {project.creatorName}</Text>
                        <Text mb={4} color="gray.500">Team size: {project.teamSize}</Text>
                        <Link href={`/Dashboard/${project.projectId}`} >
                            <Button variant="blueButton">
                                View Project
                            </Button>
                        </Link>
                        <Button onClick={() => mutate({ projectId: project.projectId, getToken})} variant="redButton">
                            Delete Project
                        </Button>
                    </Box>
                ))
            ) : (
                <Text color="gray.700">No projects available.</Text>
            )}
            <Link href="/Dashboard/Create">
                <Button variant="blueButton">
                    Create new Project
                </Button>
            </Link>
        </Flex>
    );
};

export default Page;
