"use client";

import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    IconButton,
    List,
    ListItem,
    Select,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import React, {FormEvent, useEffect, useState} from "react";
import {ChatIcon} from "@chakra-ui/icons";
import ProtectedRoute from "./ProtectedRoutes";
import useHubConnection from "@/hooks/useSignalR";
import {HubConnectionState} from "@microsoft/signalr";

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
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [messages, setMessages] = useState<Message[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [newMessage, setNewMessage] = useState<string>("");

    const {connectionStatus, sendMessage, invokeMethod} = useHubConnection('/chat', {
        onEvents: {
            ReceiveMessage: handleReceiveMessage,
            ProjectList: handleProjectList,
            MessageReceived: handleReceiveMessage,
            MessageHistory: handleMessageHistory,
        },
    });

    useEffect(() => {
        if (connectionStatus === HubConnectionState.Connected) {
            invokeMethod("RetrieveProject").catch((err) => console.error(err));
            invokeMethod("RetrieveMessageHistory").catch((err) => console.error(err));
        }
    }, [connectionStatus, invokeMethod]);

    function handleMessageHistory(messageHistory: Message[]) {
        console.log("Message history received:", messageHistory);
        setMessages(messageHistory);
    }

    function handleReceiveMessage(message: Message) {
        console.log("Message received:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function handleProjectList(projectList: Project[]) {
        setProjects(projectList);
        if (projectList.length > 0) {
            setSelectedProject(projectList[0].id);
        }
    }

    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedProject) {
            console.error("Selected project ID is null or empty.");
            return;
        }

        if (newMessage.trim() && connectionStatus === HubConnectionState.Connected) {
            const messageObj = {content: newMessage, projectId: selectedProject};
            invokeMethod("PostMessage", [messageObj]).catch((err) => console.error(err));
            setNewMessage("");
        }
    };
    return (
        <>
            <IconButton
                aria-label="ChatIcon"
                colorScheme="teal"
                onClick={onOpen}
                icon={<ChatIcon/>}
                position={"absolute"}
                right={5}
                bottom={5}
                size={"lg"}
            >
                Open
            </IconButton>
            <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>
                        Chat Messages
                        <Select
                            value={selectedProject}
                            mt={4}
                            onChange={(event) => {
                                setSelectedProject(event.target.value);
                            }}
                        >
                            {projects.map((proj, index) => (
                                <option key={index} value={proj.id}>
                                    {proj.name}
                                </option>
                            ))}
                        </Select>
                    </DrawerHeader>
                    <DrawerBody>
                        <Box px={4}>
                            <Box flex="1" mb={4}>
                                <List spacing={3}>
                                    {[...messages]
                                        .reverse()
                                        .filter((message) => message.projectId === selectedProject)
                                        .map((message, index) => (
                                            <ListItem
                                                key={index}
                                                border="1px"
                                                bg={"gray.100"}
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
                                _placeholder={{color: "gray.400"}}
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
