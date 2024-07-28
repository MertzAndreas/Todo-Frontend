"use client";
import React, {useCallback, useEffect, useState} from "react";
import {notFound} from "next/navigation";
import {Button, Flex, useDisclosure} from "@chakra-ui/react";
import Tasklist from "@/components/tasklist";
import NewTaskModal from "@/app/Dashboard/[projectId]/NewTaskModal";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import useAuthContext from "@/providers/AuthProvider";
import AddTaskList from "./addTaskList";
import Link from "next/link";
import {BASE_URL} from "@/utils/globals";

interface PageProps {
    params: {
        projectId: string;
    };
}

export type Todo = {
    taskId: number;
    title: string;
    dueDate: string;
    svg: number;
    assignedInitials: string[];
};

export type TaskList = {
    taskListId: number;
    name: string;
    tasks: Todo[];
};

export type Project = {
    name: string;
    projectId: number;
    taskLists: TaskList[];
};

const Page = ({params: {projectId}}: PageProps) => {
    if (isNaN(parseInt(projectId))) notFound();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [selectedTaskListId, setSelectedTaskListId] = useState<null | number>(
        null,
    );
    const {getToken} = useAuthContext();

    const fetchOverview = useCallback(async () => {
        const response = await fetch(
            `${BASE_URL}/api/Project/project_overview/${projectId}`,
            {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + (await getToken()),
                },
            },
        );
        const data = await response.json();
        console.log(data);
        setTaskLists(data.taskLists);
    }, [projectId, getToken]);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    const openModalWithTaskListId = (taskListId: number) => {
        setSelectedTaskListId(taskListId);
        onOpen();
    };

    const taskListOptions = taskLists.map((list) => ({
        value: list.taskListId,
        label: list.name,
    }));

    return (
        <Flex flexDir={"column"} minHeight={"100%"} m={"2rem"}>
            <Flex gap="2rem" overflowX="scroll" minHeight={"100%"}>
                {taskLists.map((list) => (
                    <Tasklist
                        openModal={() => openModalWithTaskListId(list.taskListId)}
                        taskList={list}
                        key={list.taskListId}
                    />
                ))}
                <AddTaskList projectId={parseInt(projectId)}/>
            </Flex>
            <NewTaskModal
                isOpen={isOpen}
                onClose={onClose}
                taskListId={selectedTaskListId}
                taskListOptions={taskListOptions}
            />

            <Button
                maxW={"20%"}
                alignSelf={"center"}
                margin={"2rem"}
                colorScheme={"facebook"}
                variant={"outline"}
            >
                <Link href={"/Dashboard"}>View projects</Link>
            </Button>
        </Flex>
    );
};

export default ProtectedRoutes(Page);
