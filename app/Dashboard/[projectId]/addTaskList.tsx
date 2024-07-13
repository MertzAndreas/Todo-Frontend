import { PlusIcon } from "@/utils/icons";
import {
  Button,
  Card,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { HubConnection } from "@microsoft/signalr";
import React, { FormEvent, useRef, useState } from "react";

type AddTaskListProps = {
  hubConnection: HubConnection | null;
  projectId: number;
};

export default function AddTaskList({
  hubConnection,
  projectId,
}: AddTaskListProps) {
  console.log(projectId);
  const [taskListName, setTaskListName] = useState("");
  const initRef = useRef(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newTaskList = { name: taskListName, projectId: projectId };
    hubConnection
      ?.invoke("CreateTaskList", newTaskList)
      .then(() => setTaskListName(""))
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <Card
      minHeight={"100%"}
      width={"20rem"}
      boxShadow="md"
      borderRadius="md"
      bg="white"
      marginBottom="0.25rem"
    >
      <Center height={"100%"}>
        <Popover initialFocusRef={initRef}>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  aria-label="Add Task List"
                  icon={<PlusIcon width={"auto"} height={"100%"} />}
                  variant={"ghost"}
                  colorScheme={"facebook"}
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody as={"form"} onSubmit={handleSubmit}>
                    <FormControl>
                      <FormLabel>Title of new tasklist</FormLabel>
                      <Input
                        type="text"
                        ref={initRef}
                        value={taskListName}
                        onChange={(e) => setTaskListName(e.target.value)}
                      />
                    </FormControl>
                    <PopoverFooter
                      display={"flex"}
                      justifyContent={"space-evenly"}
                      width={"100%"}
                    >
                      <Button colorScheme="blue" type="submit">
                        Button
                      </Button>
                      <Button onClick={onClose}>Close</Button>
                    </PopoverFooter>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </>
          )}
        </Popover>
      </Center>
    </Card>
  );
}
