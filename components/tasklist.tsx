import {
    Card,
    CardBody,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton, useDisclosure,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {TaskList, Todo} from "@/app/Dashboard/[projectId]/page";
import {Task} from "@/components/tasks";
import useAuthContext from "@/providers/AuthProvider";
import {PlusIcon} from "@/utils/icons";
import TaskListOptionsMenu from "./TaskListOptionsMenu";
import {BASE_URL} from "@/utils/globals";
import useHubConnection from "@/hooks/signalR/useSignalR";
import EditTaskListModal from "@/components/EditTaskListModal";

type TasklistProps = {
    taskList: TaskList;
    openModal?: () => void;
};

function formatName(longName: string) {
    if (longName.length > 13) {
        return longName.slice(0, 12) + "..";
    }
    return longName;
}

const Tasklist: React.FC<TasklistProps> = ({taskList, openModal}) => {
    const {taskListId, name, tasks} = taskList;
    const {getToken} = useAuthContext();
    const {invokeMethod} = useHubConnection('/kanban');
    const [longName, setLongName] = useState<string>(name);
    const [displayName, setDisplayName] = useState<string>(formatName(longName));
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [sortedTasks, setSortedTasks] = useState<Todo[]>(tasks);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const taskListId = e.currentTarget.id;
        const taskListParsedId = parseInt(taskListId);
        const todoId = parseInt(e.dataTransfer.getData("text/plain"));
        handleTodoListUpdate(taskListParsedId, todoId);
    };

    const handleTodoListUpdate = async (
        taskListId: number,
        todoId: number | null,
    ) => {
        if (!todoId) return;
        await fetch(`${BASE_URL}/api/Task/update_todo_list`, {
            method: "PUT",
            credentials: "include",
            headers: {
                Authorization: "Bearer " + (await getToken()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({taskId: todoId, listId: taskListId}),
        });

        return;
    };

    const handleDragStart = (e: React.DragEvent<HTMLElement>, todoId: number) => {
        e.dataTransfer.setData("text/plain", todoId.toString());
    };

    const handleNameChange = (nextValue: string) => {
        setDisplayName(nextValue);
    };

    const handleNameUpdate = async (nextValue: string) => {
        if (nextValue != null) {
            try {
                await invokeMethod("UpdateTaskList", [{Name: nextValue, TaskListId: taskListId}]);
                console.log(nextValue);
                setLongName(nextValue);
                setDisplayName(formatName(nextValue));
            } catch (err) {
                console.error("Error sending message:", err);
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
                setSortedTasks([...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
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
    }

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            id={taskListId.toString()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            marginBottom="0.25rem"
        >
            <EditTaskListModal isOpen={isOpen} onClose={onClose} taskListId={taskListId}/>
            <Card
                minHeight={"100%"}
                width={"20rem"}
                padding={"1.5rem"}
                boxShadow="md"
                borderRadius="md"
                bg="white"
            >
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="1rem"
                >
                    <Editable
                        value={displayName}
                        onChange={handleNameChange}
                        onCancel={() => setDisplayName(formatName(longName))}
                        onEdit={() => {
                            console.log(longName);
                            setDisplayName(longName);
                        }}
                        onSubmit={handleNameUpdate}
                        submitOnBlur={false}
                    >
                        <EditablePreview/>
                        <EditableInput/>
                    </Editable>
                    <TaskListOptionsMenu taskListId={taskListId} openModal={() => openModalEditList()}/>
                </Flex>
                <Flex flexDir={"column"} gap={2}>
                    <Card size="sm">
                        <CardBody padding={0}>
                            <IconButton
                                onClick={openModal}
                                colorScheme="facebook"
                                aria-label="Add task"
                                variant={"ghost"}
                                width={"100%"}
                                icon={<PlusIcon height={"50%"} width={"auto"}/>}
                            />
                        </CardBody>
                    </Card>
                    {sortedTasks.map((t) => (
                        <Task
                            key={t.taskId}
                            task={t}
                            onDragStart={(e) => handleDragStart(e, t.taskId)}
                        />
                    ))}
                </Flex>
            </Card>
        </Flex>
    );
};

export default Tasklist;
