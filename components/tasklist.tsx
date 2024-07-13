import { Card, CardBody, Flex, Heading, IconButton } from "@chakra-ui/react";
import React from "react";
import { TaskList } from "@/app/Dashboard/[projectId]/page";
import { Task } from "@/components/tasks";
import useAuthContext from "@/providers/AuthProvider";
import { PlusIcon } from "@/utils/icons";
import TaskListOptionsMenu from "./TaskListOptionsMenu";

type TasklistProps = {
  taskList: TaskList;
  openModal?: () => void;
};

const Tasklist: React.FC<TasklistProps> = ({ taskList, openModal }) => {
  const { taskListId, name, tasks } = taskList;
  const { getToken } = useAuthContext();

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
    await fetch("http://localhost:5040/api/Task/update_todo_list", {
      method: "PUT",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + (await getToken()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: todoId, listId: taskListId }),
    });

    return;
  };

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
      marginBottom="0.25rem"
    >
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
          <Heading
            as="h2"
            fontSize={"large"}
            fontWeight="bold"
            marginBottom="0.5rem"
          >
            {name}
          </Heading>
          <TaskListOptionsMenu taskListId={taskListId} />
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
                icon={<PlusIcon height={"50%"} width={"auto"} />}
              />
            </CardBody>
          </Card>
          {tasks.map((t) => (
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
