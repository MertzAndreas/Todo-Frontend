"use client"
import React, { useEffect } from 'react';
import { useToken } from "@/hooks/useToken";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            {projects.length > 0 ? (
                projects.map((project) => (
                    <div key={project.projectId} className="bg-white p-6 mb-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold">{project.name}</h2>
                        <p className="text-gray-700">{project.description}</p>
                        <p className="text-gray-500">Created by: {project.creatorName}</p>
                        <p className="text-gray-500">Team size: {project.teamSize}</p>
                        <Link href={`/Dashboard/${project.projectId}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                            View Project
                        </Link>
                        <button
                            onClick={() => mutate({ projectId: project.projectId, getToken })}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Delete Project
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-700">No projects available.</p>
            )}
            <Link href="Dashboard/Create" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Create new Project
            </Link>
        </div>
    );
};

export default Page;
