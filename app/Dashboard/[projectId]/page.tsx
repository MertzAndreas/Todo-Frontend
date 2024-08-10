'use client';
import React, { useEffect, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import { SettingsIcon } from '@chakra-ui/icons';
import { Card, Flex, Heading, HStack, IconButton, Stack, useDisclosure } from '@chakra-ui/react';
import NewTaskModal from '@/app/Dashboard/[projectId]/components/newTaskModel/NewTaskModal';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import AddTaskList from './components/AddTaskList';
import useHubConnection from '@/hooks/signalR/useSignalR';
import ProjectGroupBar from '@/app/Dashboard/[projectId]/components/ProjectGroupBar';
import Tasklist from '@/app/Dashboard/[projectId]/components/Tasklist';
import SettingsModal from '@/app/Dashboard/[projectId]/components/settings/SettingsModal';
import { handleTransferTodo } from '@/app/Dashboard/[projectId]/api/handleTransferTodo';

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
    assigneeIds: string[];
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

const Page = ({ params: { projectId } }: PageProps) => {
    if (isNaN(parseInt(projectId))) notFound();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: settingsIsOpen,
        onOpen: settingsOnOpen,
        onClose: settingsOnClose,
    } = useDisclosure();
    const [project, setProject] = useState<Project | null>(null);
    const [selectedTaskListId, setSelectedTaskListId] = useState<null | number>(null);
    const [draggingOverId, setDraggingOverId] = useState<number | null>();
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const usersRef = useRef<ProjectMember[] | null>(null);

    const { sendMessage } = useHubConnection('/kanban', {
        onEvents: {
            NewTaskList: handleNewTaskList,
            GetProjectOverview: handleGetProjectOverview,
            AddNewUser: handleNewUser,
            RemoveUser: handleRemoveUser,
            TransferTodo: (todoId: number, taskListId: number) => {
                handleTransferTodo(todoId, taskListId, setProject);
            },
            NewTask: handleNewTask,
        },
    });

    useEffect(() => {
        void sendMessage('GetProjectOverview', [projectId]);
    }, [sendMessage, projectId]);

    function handleNewTask(task: Todo, taskListId: number) {
        setProject((prevProject) => {
            if (!prevProject) {
                console.error('Project is null');
                return null;
            }

            const updatedTaskLists = prevProject.taskLists.map((list) => {
                if (list.taskListId === taskListId) {
                    return {
                        ...list,
                        tasks: [...list.tasks, task],
                    };
                }
                return list;
            });

            return {
                ...prevProject,
                taskLists: updatedTaskLists,
            };
        });
    }

    function handleGetProjectOverview(project: Project) {
        usersRef.current = project.projectMembers;
        setProject({
            ...project,
        });
    }

    function handleRemoveUser(user: ProjectMember) {
        usersRef.current = usersRef.current?.filter((member) => member.id !== user.id);
        setProject((prevProject) => ({
            ...prevProject,
            projectMembers: prevProject.projectMembers.filter((member) => member.id !== user.id),
            taskLists: prevProject.taskLists.map((taskList) => ({
                ...taskList,
                tasks: taskList.tasks.map((task) => ({
                    ...task,
                    assigneeIds: task.assigneeIds.filter((id) => id !== user.id),
                })),
            })),
        }));
    }

    function handleNewUser(user: ProjectMember) {
        usersRef.current = usersRef.current ? [...usersRef.current, user] : [user];
        setProject((prevProject) => ({
            ...prevProject,
            projectMembers: [...prevProject.projectMembers, user],
        }));
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

    const getUserById = (id: string) => {
        return usersRef.current?.find((user) => user.id === id);
    };

    const openModalWithTaskListId = (taskListId: number) => {
        setSelectedTaskListId(taskListId);
        onOpen();
    };

    const handleAddGroupMember = async (userId: string) => {
        const userDTO = {
            id: userId,
            projectId: project.projectId,
        };
        await sendMessage('AddUserToProject', [userDTO]);
    };

    const handleRemoveGroupMember = async (userId: string) => {
        const userDTO = {
            id: userId,
            projectId: project.projectId,
        };
        await sendMessage('RemoveUserFromProject', [userDTO]);
    };

    const handleTodoListUpdate = async (taskListId: number, todoId: number | null) => {
        if (!todoId) return;
        await sendMessage('TransferTodo', [todoId, taskListId]);
    };

    const taskListOptions =
        project?.taskLists.map((list) => ({
            value: list.taskListId,
            label: list.name,
        })) || [];

    if (!project) return null;

    return (
        <Flex flexDirection={'column'} height={'100%'} maxH={'100%'} m={4} overflow={'auto'}>
            <Card mb={4} p={4}>
                <Flex justifyContent="space-between" alignItems="center">
                    <ProjectGroupBar
                        projectMembers={project.projectMembers}
                        addGroupMember={handleAddGroupMember}
                        selectedMembers={selectedMembers}
                        setSelectedMembers={setSelectedMembers}
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
            <HStack flex={1} overflowY={'auto'} spacing={4}>
                {project.taskLists.map((list) => (
                    <Tasklist
                        openModal={() => openModalWithTaskListId(list.taskListId)}
                        handleTodoListUpdate={handleTodoListUpdate}
                        draggingOverId={draggingOverId}
                        selectedMembers={selectedMembers}
                        getUserById={getUserById}
                        setDraggingOverId={setDraggingOverId}
                        taskList={list}
                        key={list.taskListId}
                    />
                ))}
                <AddTaskList projectId={parseInt(projectId)} />
            </HStack>
            <NewTaskModal
                isOpen={isOpen}
                projectId={project.projectId}
                onClose={onClose}
                taskListId={selectedTaskListId}
                taskListOptions={taskListOptions}
                projectMembers={project.projectMembers}
            />
        </Flex>
    );
};

export default ProtectedRoutes(Page);
