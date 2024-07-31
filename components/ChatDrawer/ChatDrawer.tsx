'use client';

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
    Select,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import useHubConnection from '@/hooks/signalR/useSignalR';
import { HubConnectionState } from '@microsoft/signalr';
import MessageList from '@/components/ChatDrawer/MessageList';
import ProtectedComponent from '@/components/ProtectedComponent';

export type Message = {
    senderId: string;
    content: string;
    sentTime: string;
    senderName: string;
    projectId: string;
};

type Project = {
    name: string;
    projectId: string;
};

function ChatDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [messages, setMessages] = useState<Message[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [newMessage, setNewMessage] = useState<string>('');
    const { connectionStatus, invokeMethod } = useHubConnection('/chat', {
        onEvents: {
            ReceiveMessage: handleReceiveMessage,
            ProjectList: handleProjectList,
            MessageHistory: handleMessageHistory,
        },
    });

    useEffect(() => {
        if (connectionStatus === HubConnectionState.Connected) {
            invokeMethod('RetrieveProject').catch((err) => console.error(err));
            invokeMethod('RetrieveMessageHistory').catch((err) => console.error(err));
        }
    }, [connectionStatus, invokeMethod]);

    function handleMessageHistory(messageHistory: Message[]) {
        console.log('Message history received:', messageHistory);
        setMessages(messageHistory);
    }

    function handleReceiveMessage(message: Message) {
        console.log('Message received:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function handleProjectList(projectList: Project[]) {
        setProjects(projectList);
        if (projectList.length > 0) {
            console.log('Project list received:', projectList);
            setSelectedProject(projectList[0].projectId.toString());
        }
    }

    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();
        if (newMessage.trim()) {
            const messageObj = {
                content: newMessage,
                projectId: selectedProject,
            };
            invokeMethod('PostMessage', [messageObj]).catch((err) => console.error(err));
            setNewMessage('');
        }
    };

    return (
        <>
            <IconButton
                aria-label="ChatIcon"
                onClick={onOpen}
                icon={<ChatIcon />}
                position={'absolute'}
                right={5}
                bottom={5}
                size={'lg'}
            >
                Open
            </IconButton>
            <Drawer isOpen={isOpen} placement="right" size={'md'} onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        Chat Messages
                        <Select
                            value={selectedProject}
                            variant="filled"
                            mt={4}
                            onChange={(event) => {
                                setSelectedProject(event.target.value);
                            }}
                        >
                            {projects.map((proj) => (
                                <option key={proj.projectId} value={proj.projectId}>
                                    {proj.name}
                                </option>
                            ))}
                        </Select>
                    </DrawerHeader>
                    <DrawerBody>
                        <Box px={4}>
                            <Box flex="1" mb={4}>
                                <MessageList
                                    messages={messages}
                                    selectedProject={selectedProject}
                                />
                            </Box>
                        </Box>
                    </DrawerBody>
                    <DrawerFooter
                        width={'100%'}
                        flexDirection={'column'}
                        as={'form'}
                        onSubmit={handleSendMessage}
                    >
                        <FormControl mb={4}>
                            <Textarea
                                colorScheme={'facebook'}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                }}
                                placeholder="Type your message here"
                            />
                        </FormControl>
                        <Box display="flex" justifyContent="space-evenly" width={'100%'}>
                            <Button
                                type="submit"
                                colorScheme={'facebook'}
                                isDisabled={selectedProject === ''}
                            >
                                Send
                            </Button>
                            <Button colorScheme={'facebook'} variant={'outline'} onClick={onClose}>
                                Close
                            </Button>
                        </Box>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

const ProtectedChat = ProtectedComponent(ChatDrawer);
export default ProtectedChat;
