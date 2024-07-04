"use client"
import React, {useEffect, useState} from 'react';
import {getUserIdFromToken} from "@/app/utils/isTokenExpired";
import {useToken} from "@/app/hooks/useToken";
import Link from "next/link";
import {id} from "postcss-selector-parser";

interface Project {
    projectId: number,
    name: string,
    description: string,
    creatorName : string;
    teamSize: number;
}

const Page = () => {
    const { validateToken } = useToken('/Account/Login');
    const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
        validateToken();
    }, [validateToken]);
    useEffect(() => {
        const fetchData = async () => {
            const penis = getUserIdFromToken()

            if(penis == null){
                throw new Error("dwqdw")
            }
            const response = await fetch(`http://localhost:5040/api/Project/get_projects/${penis}`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            if (response.ok){
                const data = await response.json();
                console.log(data)
                setProjects(data)
            }

        }
        fetchData();
    }, []);

    async function handleDelete(projectId: number) {
        const response = await fetch(`http://localhost:5040/api/Project/${projectId}`,{
            method : "DELETE",
            credentials : "include",
            headers : {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok){
            throw new Error("dwqdq");
        }

        const filteredData = projects.filter(project => project.projectId !== projectId)
        setProjects(filteredData);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.projectId} className="bg-white p-6 mb-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">{project.name}</h2>
                            <p className="text-gray-700">{project.description}</p>
                            <p className="text-gray-500">Created by: {project.creatorName}</p>
                            <p className="text-gray-500">Team size: {project.teamSize}</p>
                            <Link href={`/Dashboard/Project/${project.projectId}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                                View Project
                            </Link>
                            <button onClick={() => handleDelete(project.projectId)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                                Delete Project
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">No projects available.</p>
                )}
            <Link href="/Dashboard/Create" className={"mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"}>
                    Create new Project
            </Link>
        </div>
    );
};

export default Page;