"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useSignalR } from "@/hooks/useSignalR";
import { Flex, useDisclosure } from "@chakra-ui/react";
import Tasklist from "@/components/tasklist";
import NewTaskModal from "@/app/Dashboard/[projectId]/NewTaskModal";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import useAuthContext from "@/providers/AuthProvider";

interface PageProps {
  params: {
    projectId: number;
  };
}

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
  if (isNaN(projectId)) notFound();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<null | number>(
    null,
  );
  const [connection, isConnected] = useSignalR();
  const { getToken } = useAuthContext();
  useEffect(() => {
    const fetchOverview = async () => {
      fetch("http://localhost:5040/api/Project/project_overview/" + projectId, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await getToken()),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTaskLists(data.taskLists);
        });
    };

    fetchOverview();
  }, []);

  const openModalWithTaskListId = (taskListId: number) => {
    setSelectedTaskListId(taskListId);
    onOpen();
  };

  const taskListOptions = taskLists.map((list) => ({
    value: list.taskListId,
    label: list.name,
  }));

  if (!isConnected) return <h1>Connecting...</h1>;

  return (
    <>
      <Flex gap="2rem" alignItems="start" overflowX="scroll" height="100%">
        {taskLists.map((list) => (
          <Tasklist
            openModal={() => openModalWithTaskListId(list.taskListId)}
            taskList={list}
            key={list.taskListId}
          />
        ))}
      </Flex>
      <NewTaskModal
        isOpen={isOpen}
        onClose={onClose}
        taskListId={selectedTaskListId}
        taskListOptions={taskListOptions}
      />
    </>
  );
};

export default ProtectedRoutes(Page);
