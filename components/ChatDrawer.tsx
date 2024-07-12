"use client";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Box,
  List,
  ListItem,
  Text,
  FormControl,
  Select,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import { ChatIcon } from "@chakra-ui/icons";
import ProtectedRoute from "./ProtectedRoutes";

type Message = {
  senderId: string;
  content: string;
  sentTime: string;
  senderName: string;
  projectId: string;
};

type Project = {
  name: string;
  id: string;
};

function ChatDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [connection, isConnected] = useSignalR();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [project, setProject] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {
    if (!connection) return;

    connection.on("ProjectList", handleProjectList);
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageHistory", handleMessageHistory);

    if (isConnected) {
      connection.invoke("RetrieveProject").catch((err) => console.error(err));
      connection
        .invoke("RetrieveMessageHistory")
        .catch((err) => console.error(err));
    }

    return () => {
      connection.off("ProjectList", handleProjectList);
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageHistory", handleMessageHistory);
    };
  }, [connection, isConnected]);

  const handleReceiveMessage = (
    senderId: string,
    content: string,
    sentTime: string,
    senderName: string,
    projectId: string,
  ) => {
    console.log(content);
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId, content, sentTime, senderName, projectId },
    ]);
  };

  const handleMessageHistory = (messageHistory: Message[]) => {
    setMessages(messageHistory);
  };

  const handleProjectList = (projectList: Project[]) => {
    setProject(projectList);
    console.log(projectList);
    setSelectedProject(projectList[0].id);
  };
  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Selected Project ID:", selectedProject); // Debugging log

    if (!selectedProject) {
      console.error("Selected project ID is null or empty.");
      return;
    }

    if (newMessage.trim() && connection?.state === "Connected") {
      const messageObj = { content: newMessage, projectId: selectedProject };
      console.log("Sending message:", messageObj); // Debugging log

      connection
        .invoke("PostMessage", messageObj)
        .then(() => setNewMessage(""))
        .catch((err) => console.error("Error sending message:", err));
    }
  };

  return (
    <>
      <IconButton
        aria-label="ChatIcon"
        colorScheme="teal"
        onClick={onOpen}
        icon={<ChatIcon />}
        position={"absolute"}
        right={5}
        bottom={5}
      >
        Open
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" size={"sm"} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Chat Messages
            <Select
              value={selectedProject}
              mt={4}
              onChange={(event) => {
                setSelectedProject(event.target.value);
              }}
            >
              {project.map((proj, index) => (
                <option key={index} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </Select>
          </DrawerHeader>
          <DrawerBody>
            <Box px={4} bg="gray.100">
              <Box flex="1" mb={4}>
                <List spacing={3}>
                  {[...messages]
                    .reverse()
                    .filter((message) => message.projectId === selectedProject)
                    .map((message, index) => (
                      <ListItem
                        key={index}
                        bg="babyBlue"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={2}
                      >
                        <Text fontSize="sm" color="darkGray">
                          {message.senderName}
                        </Text>
                        <Text>{message.content}</Text>
                        <Text as="em" fontSize="sm" color="gray.500">
                          {new Date(message.sentTime).toLocaleString()}
                        </Text>
                      </ListItem>
                    ))}
                </List>
              </Box>
            </Box>
          </DrawerBody>

          <DrawerFooter
            width={"100%"}
            flexDirection={"column"}
            as={"form"}
            onSubmit={handleSendMessage}
          >
            <FormControl mb={4}>
              <Textarea
                name="messageInput"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
                placeholder="Type your message here"
                bg="white"
                borderColor="gray.300"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>
            <Box display="flex" justifyContent="space-evenly" width={"100%"}>
              <Button
                type="submit"
                variant="blueButton"
                isDisabled={
                  selectedProject === "" || selectedProject == undefined
                }
              >
                Send
              </Button>
              <Button variant="greyButton" onClick={onClose}>
                Close
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const ProtectedChat = ProtectedRoute(ChatDrawer);
export default ProtectedChat;

