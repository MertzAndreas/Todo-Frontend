import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { TaskList } from "@/app/Dashboard/[projectId]/page";
import { Task } from "@/components/tasks";
import {useToken} from "@/hooks/useToken";

const Tasklist = ({ taskList: { name, tasks, taskListId } }: { taskList: TaskList }) => {
    const {getToken} = useToken();
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const taskListId = e.currentTarget.id;
        const taskListParsedId = parseInt(taskListId);
        const todoId = parseInt(e.dataTransfer.getData("text/plain"));

        console.log('handleDrop: Dropped with todoId:', todoId);
        handleTodoListUpdate(taskListParsedId, todoId);
    };

    function handleTodoListUpdate(taskListId: number, todoId: number | null) {
        console.log('handleTodoListUpdate:', taskListId, todoId);
    }

    const handleDragStart = (e: React.DragEvent<HTMLElement>, todoId: number) => {
        console.log('handleDragStart: Setting draggable.current to', todoId);
        e.dataTransfer.setData("text/plain", todoId.toString());
        console.log('handleDragStart: draggable.current set to', todoId);
    };

    async function handleAddTask() {
        const data = {
            title: "New Task",
            description: "New Task Description",
            dueDate: new Date(Date.now()).toISOString(),
            taskListId: taskListId,
            iconId: 1,
            assignedUsersEmails: ["andreasmertz1@gmail.com"]
        }
        
        
        console.log(data)
        fetch(`http://localhost:5040/api/Task`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify(data),
        })
    }

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            id={taskListId.toString()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <Box width={"20rem"}>
                <Box>
                    <Heading mb="1rem" as="h1">{name}</Heading>
                    <Box as={"button"} onClick={handleAddTask}>Add</Box>
                </Box>
                {tasks.map(t => (
                    <Task
                        task={t}
                        key={t.taskId}
                        onDragStart={(e) => handleDragStart(e, t.taskId)}
                    />
                ))}
            </Box>
        </Flex>
    );
};

export default Tasklist;