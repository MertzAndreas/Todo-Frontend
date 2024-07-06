"use client"
import React, {useEffect, useState} from 'react';
import {notFound} from "next/navigation";
import {useSignalR} from "@/hooks/useSignalR";
import {Container, Flex} from "@chakra-ui/react";
import Tasklist from "@/components/tasklist";

interface PageProps {
    params: {
        projectId: number;
    };
}

export type AssignedTo = {
    Initials: string;
    Color: string;
}

export type TaskListTask = {
    Title: string;
    Date: Date;
    SVG: string;
    AssignedTo: AssignedTo[];
}

export type TaskList = {
    id: number;
    name: string;
    tasks: TaskListTask[];
}


const Page = ({ params : {projectId} } : PageProps) => {
    if(isNaN(projectId)) notFound();

    const [taskLists, setTaskLists] = useState<TaskList[]>([])
    const [connection, isConnected] = useSignalR()


    useEffect(() => {
        // Simulate fetching data from the backend
        const pseudoData: TaskList[] = [
            {
                id: 1,
                name: "To Do",
                tasks: [
                    {
                        Title: "Design Landing Page",
                        Date: new Date(),
                        SVG: "<svg></svg>",
                        AssignedTo: [{ Initials: "AB", Color: "red" }, { Initials: "CD", Color: "blue" }]
                    },
                    {
                        Title: "Set Up Database",
                        Date: new Date(),
                        SVG: "<svg></svg>",
                        AssignedTo: [{ Initials: "EF", Color: "green" }]
                    }
                ]
            },
            {
                id: 2,
                name: "In Progress",
                tasks: [
                    {
                        Title: "Develop Authentication",
                        Date: new Date(),
                        SVG: "<svg></svg>",
                        AssignedTo: [{ Initials: "GH", Color: "purple" }]
                    }
                ]
            },
            {
                id: 3,
                name: "Completed",
                tasks: [
                    {
                        Title: "Write Unit Tests",
                        Date: new Date(),
                        SVG: "<svg></svg>",
                        AssignedTo: [{ Initials: "IJ", Color: "orange" }]
                    }
                ]
            }
        ];

        setTaskLists(pseudoData);
    }, []);

    if(!isConnected) return <h1>Connecting...</h1>

    return (
        <Container>
            <Flex flexDirection={"row"} gap={"2rem"}>
                {taskLists.map(list => <Tasklist taskList={list} key={list.id}/>)}
            </Flex>
        </Container>
    );
};

export default Page;
