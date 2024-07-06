"use client"
import React, {useState} from 'react';
import {notFound} from "next/navigation";
import {useSignalR} from "@/hooks/useSignalR";

interface PageProps {
    params: {
        projectId: number;
    };
}

interface Task {
    TodoId: number;
    Title: string;
    completed: boolean;
}

interface TaskList {
    id: number;
    name: string;
    tasks: Task[];
}

const Page: React.FC<PageProps> = ({ params : {projectId}}) => {
    if(isNaN(projectId)) notFound();

    const [taskLists, setTaskLists] = useState<TaskList[]>([])
    const [connection, isConnected] = useSignalR()
    if(!isConnected) return <h1>Connecting...</h1>

    return (
        <div>

        </div>
    );
};

export default Page;
