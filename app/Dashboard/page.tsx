'use client';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, SimpleGrid, Text, Link, Box } from '@chakra-ui/react';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import useAuthContext from '@/providers/AuthProvider';
import { BASE_URL } from '@/utils/globals';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import ProjectCard from '@/app/Dashboard/ProjectCard';

export type DashboardProject = {
    projectId: number;
    name: string;
    description: string;
    projectMembers: ProjectMember[];
};

const fetchProjects = async (getToken: () => Promise<string>) => {
    const response = await fetch(`${BASE_URL}/api/Project/get_projects`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }

    return response.json();
};

const deleteProject = async ({
    projectId,
    getToken,
}: {
    projectId: number;
    getToken: () => Promise<string>;
}) => {
    const response = await fetch(`${BASE_URL}/api/Project/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete project');
    }

    return projectId;
};

const Page = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuthContext();

    const {
        data: projects = [],
        isLoading,
        error,
    } = useQuery<DashboardProject[]>({
        queryKey: ['projects'],
        queryFn: () => fetchProjects(getToken),
        staleTime: 1000 * 60 * 2,
    });

    const { mutate } = useMutation({
        mutationFn: deleteProject,
        onSuccess: (deletedProjectId) => {
            queryClient.setQueryData<DashboardProject[]>(['projects'], (oldProjects) =>
                oldProjects?.filter((project) => project.projectId !== deletedProjectId),
            );
        },
        onError: (error) => {
            console.error(error);
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading projects</p>;

    return (
        <>
            <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                m={'auto'}
                width={'100%'}
            >
                <SimpleGrid
                    columns={[1, 2]}
                    gap="40px" // Adjust the spacing as needed'
                    width="90%"
                >
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                                key={project.projectId}
                                project={project}
                                mutate={() => mutate({ projectId: project.projectId, getToken })}
                            />
                        ))
                    ) : (
                        <Text color="gray.700">No projects available.</Text>
                    )}
                </SimpleGrid>
                <Box mt={4}>
                    <Link href="/Dashboard/Create">
                        <Button variant={'outline'}>Create new Project</Button>
                    </Link>
                </Box>
            </Flex>
        </>
    );
};

export default ProtectedRoutes(Page);
