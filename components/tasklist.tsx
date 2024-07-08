import {Box, Card, Flex, Heading, HStack, Icon, Spacer} from "@chakra-ui/react";
import React from "react";
import { TaskList } from "@/app/Dashboard/[projectId]/page";
import { Task } from "@/components/tasks";
import {useToken} from "@/hooks/useToken";
import {PlusSquareIcon} from "@chakra-ui/icons";

type TasklistProps = {
    taskList: TaskList;
    openModal?: () => void;
};

const Tasklist: React.FC<TasklistProps> = ({ taskList, openModal }) => {
    const { taskListId, name, tasks } = taskList;
    const { getToken } = useToken();
    
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

    const handleTodoListUpdate = async (taskListId: number, todoId: number | null) => {
        if (!todoId) return;
        await fetch("http://localhost:5040/api/Task/update_todo_list", {
            method: "PUT",
            credentials: "include",
            headers: {
                'Authorization': "Bearer " + await getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId: todoId, listId: taskListId })
        })
        
        return;
    }

    const handleDragStart = (e: React.DragEvent<HTMLElement>, todoId: number) => {
        e.dataTransfer.setData("text/plain", todoId.toString());
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            id={taskListId.toString()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            marginBottom="2rem" // Example margin for spacing
        >
            <Card width={"20rem"} padding={"1.5rem"} boxShadow="md" borderRadius="md" bg="white">
                <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
                    <Heading as="h1" fontWeight="bold" marginBottom="0.5rem">
                        {name}
                    </Heading>
                    <Icon
                        as={PlusSquareIcon}
                        boxSize={8} 
                        color="blue.500"
                        cursor={"pointer"}
                        _hover={{ color: 'blue.600' }}
                        onClick={openModal}
                    />
                </Flex>
                {tasks.map(t => (
                    <Task
                        key={t.taskId}
                        task={t}
                        onDragStart={(e) => handleDragStart(e, t.taskId)}
                    />
                ))}
            </Card>
        </Flex>
    );
};

export default Tasklist;