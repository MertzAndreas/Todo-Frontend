import {
    Card,
    CardBody,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ProjectMember, TaskList, Todo } from '@/app/Dashboard/[projectId]/page';
import { PlusIcon } from '@/utils/icons';
import TaskListOptionsMenu from './TaskListOptionsMenu';
import useHubConnection from '@/hooks/signalR/useSignalR';
import EditTaskListModal from '@/app/Dashboard/[projectId]/components/EditTaskListModal';
import { Task } from '@/app/Dashboard/[projectId]/components/Tasks';
import debounce from 'lodash/debounce';
import { sort } from 'next/dist/build/webpack/loaders/css-loader/src/utils';

function formatName(longName: string) {
    if (longName.length > 13) {
        return longName.slice(0, 12) + '..';
    }
    return longName;
}

const recursiveParentWalk = (element: HTMLElement, id: number) => {
    if (element.parentElement === null) return false;

    if (parseInt(element?.id) === id) {
        return true;
    }

    return recursiveParentWalk(element.parentElement, id);
};

type TasklistProps = {
    taskList: TaskList;
    openModal?: () => void;
    handleTodoListUpdate: (taskListId: number, todoId: number | null) => Promise<void>;
    draggingOverId: number;
    setDraggingOverId: React.Dispatch<React.SetStateAction<number>>;
    selectedMembers?: string[];
    getUserById: (id: string) => ProjectMember;
};

const Tasklist: React.FC<TasklistProps> = ({
    taskList,
    openModal,
    handleTodoListUpdate,
    draggingOverId,
    setDraggingOverId,
    selectedMembers,
    getUserById,
}) => {
    const { taskListId, name, tasks } = taskList;
    const { invokeMethod } = useHubConnection('/kanban');
    const [longName, setLongName] = useState<string>(name);
    const [displayName, setDisplayName] = useState<string>(formatName(longName));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sortedTasks, setSortedTasks] = useState<Todo[]>(tasks);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOverId(taskListId);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingOverId(taskListId);
    };

    const handleDragLeave = debounce((e: React.DragEvent<HTMLDivElement>) => {
        const newTarget = e.relatedTarget as HTMLElement;
        if (recursiveParentWalk(newTarget, taskListId)) return;
        setDraggingOverId(null);
    }, 50);

    const handleDrop = async (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData('text/plain');
        const { todoId, listId } = JSON.parse(data);
        const taskListParsedId = parseInt(listId);
        const todoParsedId = parseInt(todoId);
        if (taskListId === taskListParsedId) return;

        await handleTodoListUpdate(taskListId, todoParsedId);
        setDraggingOverId(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLElement>, todoId: number) => {
        const data = {
            todoId: todoId.toString(),
            listId: taskListId.toString(),
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
    };

    const handleDragStop = () => {
        setDraggingOverId(null);
    };

    const handleNameChange = (nextValue: string) => {
        setDisplayName(nextValue);
    };

    const handleNameUpdate = async (nextValue: string) => {
        if (nextValue != null) {
            try {
                await invokeMethod('UpdateTaskList', [{ Name: nextValue, TaskListId: taskListId }]);
                setLongName(nextValue);
                setDisplayName(formatName(nextValue));
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    useEffect(() => {
        const sortSetting = localStorage.getItem('sortSetting');

        switch (sortSetting) {
            case '1': {
                setSortedTasks([...tasks].sort((a, b) => a.taskId - b.taskId));
                break;
            }
            case '2': {
                setSortedTasks([...tasks].sort((a, b) => a.title.localeCompare(b.title)));
                break;
            }
            case '3': {
                setSortedTasks(
                    [...tasks].sort(
                        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
                    ),
                );
                break;
            }
            default: {
                setSortedTasks(tasks);
                break;
            }
        }
    }, [isOpen, tasks]);

    const openModalEditList = () => {
        onOpen();
    };

    //Filter tasks such that only tasks which has at least one task.assignedIds which is equal to selectedMembers, if any are selected otherwise show all
    const filteredTasks =
        selectedMembers.length === 0
            ? sortedTasks
            : sortedTasks.filter((task) =>
                  task.assigneeIds.some((id) => selectedMembers.includes(id)),
              );

    console.log(filteredTasks);

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            id={taskListId.toString()}
            marginBottom="0.25rem"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <EditTaskListModal isOpen={isOpen} onClose={onClose} />
            <Card
                minHeight={'100%'}
                variant={draggingOverId === taskListId ? 'hovered' : 'elevated'}
                width={'20rem'}
                padding={'1.5rem'}
                boxShadow="md"
                borderRadius="md"
                transition={'background-color 0.3s ease-in-out'}
            >
                <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
                    <Editable
                        as={'h2'}
                        fontSize="2xl"
                        fontWeight={'bold'}
                        value={displayName}
                        onChange={handleNameChange}
                        onCancel={() => setDisplayName(formatName(longName))}
                        onEdit={() => {
                            setDisplayName(longName);
                        }}
                        onSubmit={handleNameUpdate}
                        submitOnBlur={false}
                    >
                        <EditablePreview />
                        <EditableInput />
                    </Editable>
                    <TaskListOptionsMenu
                        taskListId={taskListId}
                        openModal={() => openModalEditList()}
                    />
                </Flex>
                <Flex flexDir={'column'} gap={2}>
                    <Card size="sm" variant={'secondary'}>
                        <CardBody padding={0}>
                            <IconButton
                                onClick={openModal}
                                aria-label="Add task"
                                variant={'ghost'}
                                width={'100%'}
                                icon={<PlusIcon height={'50%'} width={'auto'} />}
                            />
                        </CardBody>
                    </Card>
                    {filteredTasks.map((t) => (
                        <Task
                            key={t.taskId}
                            task={t}
                            onDragStop={handleDragStop}
                            getUserById={getUserById}
                            onDragStart={(e) => handleDragStart(e, t.taskId)}
                        />
                    ))}
                </Flex>
            </Card>
        </Flex>
    );
};

export default Tasklist;
