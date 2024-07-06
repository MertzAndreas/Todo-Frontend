import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { TaskList } from "@/app/Dashboard/[projectId]/page";
import { Task } from "@/components/tasks";

const Tasklist = ({ taskList: { name, tasks, id } }: { taskList: TaskList }) => {

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

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            id={id.toString()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <Box width={"20rem"}>
                <Heading mb="1rem" as="h1">{name}</Heading>
                {tasks.map(t => (
                    <Task
                        task={t}
                        key={t.Id}
                        onDragStart={(e) => handleDragStart(e, t.Id)}
                    />
                ))}
            </Box>
        </Flex>
    );
};

export default Tasklist;