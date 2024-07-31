'use client';
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import Tasklist from '@/components/tasklist';
import NewTaskModal from '@/app/Dashboard/[projectId]/NewTaskModal';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import AddTaskList from './addTaskList';
import Link from 'next/link';
import useHubConnection from '@/hooks/signalR/useSignalR';

type PageProps = {
    params: {
        projectId: string;
    };
};

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

const Page = ({ params: { projectId } }: PageProps) => {
    if (isNaN(parseInt(projectId))) notFound();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [selectedTaskListId, setSelectedTaskListId] = useState<null | number>(null);

    const { invokeMethod } = useHubConnection('/kanban', {
        onEvents: {
            NewTaskList: handleNewTaskList,
            GetProjectOverview: handleGetProjectOverview,
        },
    });

    function handleGetProjectOverview(project: Project) {
        setTaskLists(project.taskLists);
    }

    function handleNewTaskList(tasklist: TaskList) {
        setTaskLists((prevTaskLists) => [...prevTaskLists, tasklist]);
    }

    useEffect(() => {
        invokeMethod('GetProjectOverview', [projectId]);
    }, [invokeMethod, projectId]);

    const openModalWithTaskListId = (taskListId: number) => {
        setSelectedTaskListId(taskListId);
        onOpen();
    };

    const taskListOptions = taskLists.map((list) => ({
        value: list.taskListId,
        label: list.name,
    }));

    return (
        <Flex flexDir="column" flexGrow={1} m="2rem" height="100%">
            <Flex gap="2rem" overflowX="scroll" flexGrow={1}>
                {taskLists.map((list) => (
                    <Tasklist
                        openModal={() => openModalWithTaskListId(list.taskListId)}
                        taskList={list}
                        key={list.taskListId}
                    />
                ))}
                <AddTaskList projectId={parseInt(projectId)} />
            </Flex>
            <NewTaskModal
                isOpen={isOpen}
                onClose={onClose}
                taskListId={selectedTaskListId}
                taskListOptions={taskListOptions}
            />
        </Flex>
    );
};

export default ProtectedRoutes(Page);
