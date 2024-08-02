'use client';
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import {
    Card,
    Flex,
    Heading,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';
import NewTaskModal from '@/app/Dashboard/[projectId]/components/NewTaskModal';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import AddTaskList from './components/AddTaskList';
import useHubConnection from '@/hooks/signalR/useSignalR';
import { SettingsIcon } from '@chakra-ui/icons';
import ProjectGroupBar from '@/app/Dashboard/[projectId]/components/ProjectGroupBar';
import Tasklist from '@/app/Dashboard/[projectId]/components/Tasklist';
import SettingsModal from '@/app/Dashboard/[projectId]/components/settings/SettingsModal';

type PageProps = {
    params: {
        projectId: string;
    };
}

export type Todo = {
    taskId: number;
    title: string;
    dueDate: string;
    svg: number;
    assignees: string[];
};

export type TaskList = {
    taskListId: number;
    name: string;
    tasks: Todo[];
};

export type ProjectMember = {
    id: string;
    name: string;
    email: string;
};

export type Project = {
    name: string;
    projectId: number;
    taskLists: TaskList[];
    projectMembers: ProjectMember[];
};


const Page = ({params: {projectId}}: PageProps) => {
    if (isNaN(parseInt(projectId))) notFound();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: settingsIsOpen,
        onOpen: settingsOnOpen,
        onClose: settingsOnClose,
    } = useDisclosure();
    const [project, setProject] = useState<Project | null>(null);
    const [selectedTaskListId, setSelectedTaskListId] = useState<null | number>(null);

    const { invokeMethod, sendMessage } = useHubConnection('/kanban', {
        onEvents: {
            NewTaskList: handleNewTaskList,
            GetProjectOverview: handleGetProjectOverview,
            AddNewUser: handleNewUser,
            removeUser: removeUser,
        },
    });

    function removeUser(user: ProjectMember) {
        setProject((prevProject) => ({
            ...prevProject,
            projectMembers: prevProject.projectMembers.filter((member) => member.id !== user.id),
        }));
    }

    function handleNewUser(user: ProjectMember) {
        setProject((prevProject) => ({
            ...prevProject,
            projectMembers: [...prevProject.projectMembers, user],
        }));
    }

    function handleGetProjectOverview(project: Project) {
        setProject({
            ...project,
        });
    }

    function handleNewTaskList(tasklist: TaskList) {
        setProject((prevProject) => {
            if (!prevProject) return null;
            return {
                ...prevProject,
                taskLists: [...prevProject.taskLists, tasklist],
            };
        });
    }

    useEffect(() => {
        invokeMethod("GetProjectOverview", [projectId]);
    }, [invokeMethod, projectId]);

    const openModalWithTaskListId = (taskListId: number) => {
        setSelectedTaskListId(taskListId);
        onOpen();
    };

    const handleAddGroupMember = (userId: string) => {
        const userDTO = {
            id: userId,
            projectId: project.projectId,
        };
        sendMessage('AddUserToProject', [userDTO]);
    };

    const handleRemoveGroupMember = (userId: string) => {
        const userDTO = {
            id: userId,
            projectId: project.projectId,
        };
        sendMessage('RemoveUserFromProject', [userDTO]);
    };

    const taskListOptions =
        project?.taskLists.map((list) => ({
            value: list.taskListId,
            label: list.name,
        })) || [];

    if (!project) return null;

    return (
        <Flex flexDir="column" flexGrow={1} m="2rem" height="100%">
            <Card mb={4} p={4}>
                <Flex justifyContent="space-between" alignItems="center">
                    <ProjectGroupBar
                        projectMembers={project.projectMembers}
                        addGroupMember={handleAddGroupMember}
                    />
                    <Heading>{project.name}</Heading>
                    <IconButton
                        size={'lg'}
                        variant={'ghost'}
                        icon={<SettingsIcon width={'auto'} height={'60%'} />}
                        aria-label={'Settings'}
                        onClick={settingsOnOpen}
                    />
                    <SettingsModal
                        onClose={settingsOnClose}
                        isOpen={settingsIsOpen}
                        projectMembers={project.projectMembers}
                        handleRemoveGroupMember={handleRemoveGroupMember}
                    />
                </Flex>
            </Card>
            <Flex gap="2rem" overflowX="scroll" flexGrow={1}>
                {project.taskLists.map((list) => (
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
