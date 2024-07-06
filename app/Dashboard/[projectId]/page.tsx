"use client"
import React, {useEffect, useState} from 'react';
import {notFound} from "next/navigation";
import {useSignalR} from "@/hooks/useSignalR";
import {Flex} from "@chakra-ui/react";
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
    Id: number;
    Title: string;
    Date: Date;
    SVG: number;
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
                        Id: 1,
                        Title: "Design Landing Page ewin ewnin wnnew",
                        Date: new Date(1720535296000),
                        SVG: 2,
                        AssignedTo: [{ Initials: "AB", Color: "red" }, { Initials: "CD", Color: "blue" }]
                    },
                    {
                        Id: 2,
                        Title: "Set Up Database",
                        Date: new Date(1722176896000),
                        SVG: 4,
                        AssignedTo: [{ Initials: "EF", Color: "green" }]
                    }
                ]
            },
            {
                id: 2,
                name: "In Progress",
                tasks: [
                    {
                        Id: 3,
                        Title: "Develop Authentication",
                        Date: new Date(1720103296000),
                        SVG: 4,
                        AssignedTo: [{ Initials: "GH", Color: "purple" }]
                    }
                ]
            },
            {
                id: 3,
                name: "Completed",
                tasks: [
                    {
                        Id: 4,
                        Title: "Write Unit Tests",
                        Date: new Date(1720283296000),
                        SVG: 1,
                        AssignedTo: [{ Initials: "IJ", Color: "orange" }]
                    }
                ]
            },
            {
                id: 4,
                name: "Completed",
                tasks: [
                    {
                        Id: 5,
                        Title: "Write Unit Tests",
                        Date: new Date(1720283296000),
                        SVG: 1,
                        AssignedTo: [{ Initials: "IJ", Color: "orange" }]
                    }
                ]
            },
            {
                id: 5,
                name: "Completed",
                tasks: [
                    {
                        Id: 6,
                        Title: "Write Unit Tests",
                        Date: new Date(1720283296000),
                        SVG: 1,
                        AssignedTo: [{ Initials: "IJ", Color: "orange" }]
                    }
                ]
            },
        ];

        setTaskLists(pseudoData);
    }, []);

    if(!isConnected) return <h1>Connecting...</h1>

    return (
        <Flex gap={"2rem"} alignItems={"start"} overflowX={"scroll"} height="100%">
            {taskLists.map(list => <Tasklist taskList={list} key={list.id}/>)}
        </Flex>
    );
};

export default Page;
