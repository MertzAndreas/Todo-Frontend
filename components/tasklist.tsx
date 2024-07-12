import { Card, Editable, EditableInput, EditablePreview, Flex, IconButton } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { TaskList } from "@/app/Dashboard/[projectId]/page";
import { Task } from "@/components/tasks";
import useAuthContext from "@/providers/AuthProvider";
import { PlusIcon } from "@/utils/icons";
import {HubConnection} from "@microsoft/signalr";

type TasklistProps = {
  taskList: TaskList;
  openModal?: () => void;
  connection: HubConnection | null;
};

const Tasklist: React.FC<TasklistProps> = ({ taskList, openModal, connection }) => {
  const { taskListId, name, tasks } = taskList;
  const { getToken } = useAuthContext();
   const [longName, setLongName] = useState<string>(name);

  const formatName = (longName: string) => {
    if (longName.length > 13) {
      return longName.slice(0, 12) + "..";
    }
    return longName;
  };

  const [displayName, setDisplayName] = useState<string>(formatName(longName));

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

  const handleNameChange = (nextValue: string) => {
    setDisplayName(nextValue);
  };

  const handleNameUpdate = async (nextValue: string) => {
    if (!connection) {
      console.error("No SignalR connection available.");
      return;
    }

    if(nextValue != null)
    {
      try {
        await connection.invoke("UpdateTaskList", { Name: nextValue, TaskListId: taskListId });
        console.log(nextValue);
        setLongName(nextValue);
        setDisplayName(formatName(nextValue));
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
    console.log("What the fuck");
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
              <EditablePreview />
              <EditableInput
              />
            </Editable>
            <IconButton
                aria-label="Add task"
                icon={<PlusIcon width={"auto"} height={"65%"} />}
                variant={"ghost"}
                colorScheme="facebook"
                size={"lg"}
                cursor={"pointer"}
                onClick={openModal}
            />
          </Flex>
          {tasks.map((t) => (
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
