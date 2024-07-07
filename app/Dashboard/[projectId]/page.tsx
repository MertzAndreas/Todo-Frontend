"use client"
import React, {useEffect, useState} from 'react';
import {notFound} from "next/navigation";
import {useSignalR} from "@/hooks/useSignalR";
import {Flex} from "@chakra-ui/react";
import Tasklist from "@/components/tasklist";
import {useToken} from "@/hooks/useToken";
import ChatDrawer from "@/components/ChatDrawer";

interface PageProps {
    params: {
        projectId: number;
    };
}

export type Todo = {
    taskId: number;
    title: string;
    dueDate: string;
    svg: number;
    assignedInitials: string[];
}

export type TaskList = {
    taskListId: number;
    name: string;
    tasks: Todo[];
}

export type Project = {
    name : string
    projectId : number
    taskLists : TaskList[]

}

const Page = ({ params : {projectId} } : PageProps) => {
    if(isNaN(projectId)) notFound();
    const [taskLists, setTaskLists] = useState<TaskList[]>([])
    const [connection, isConnected] = useSignalR()
    const {getToken } = useToken()

    useEffect(() => {
        const fetchOverview = async () => {
            fetch("http://localhost:5040/api/Project/project_overview/" + projectId, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getToken()
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setTaskLists(data.taskLists)
                })
        }

        fetchOverview();
    }, []);

    if(!isConnected) return <h1>Connecting...</h1>

    return (
        <>
        <Flex gap={"2rem"} alignItems={"start"} overflowX={"scroll"} height="100%">
            {taskLists.map(list => <Tasklist taskList={list} key={list.taskListId}/>)}
        </Flex>
     <ChatDrawer />
</>
    );
};

export default Page;
