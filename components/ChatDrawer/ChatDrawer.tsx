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
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Select,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import useHubConnection from '@/hooks/signalR/useSignalR';
import { HubConnectionState } from '@microsoft/signalr';
import MessageList from '@/components/ChatDrawer/MessageList';
import ProtectedComponent from '@/components/ProtectedComponent';
import { SubmitHandler, useForm } from 'react-hook-form';

export type Message = {
    senderId: string;
    content: string;
    sentTime: string;
    senderName: string;
    projectId: string;
    currentUserName?: string;
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
    const initialFocus = useRef<HTMLTextAreaElement | null>(null);

    const { connectionStatus, invokeMethod } = useHubConnection('/chat', {
        onEvents: {
            ReceiveMessage: handleReceiveMessage,
            ProjectList: handleProjectList,
            MessageHistory: handleMessageHistory,
        },
    });

    const {
        handleSubmit,
        setValue,
        register,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: { message: '' },
    });

    useEffect(() => {
        if (connectionStatus === HubConnectionState.Connected) {
            invokeMethod('RetrieveProject').catch((err) => console.error(err));
            invokeMethod('RetrieveMessageHistory').catch((err) => console.error(err));
        }
    }, [connectionStatus, invokeMethod]);

    function handleMessageHistory(messageHistory: Message[]) {
        setMessages(messageHistory);
    }

    function handleReceiveMessage(message: Message) {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function handleProjectList(projectList: Project[]) {
        setProjects(projectList);
        if (projectList.length > 0) {
            setSelectedProject(projectList[0].projectId.toString());
        }
    }

    const handleSendMessage: SubmitHandler<{ message: string }> = async (data) => {
        const { message } = data;
        if (!message.trim()) return;

        const messageObj = {
            content: message,
            projectId: selectedProject,
        };
        try {
            setValue('message', '');
            await invokeMethod('PostMessage', [messageObj]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(handleSendMessage)();
        }
    };
    const handleChangeSelectedProject = (e: ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setSelectedProject(projectId);
    };

    return (
        <>
            <Box>
                <IconButton
                    aria-label="ChatIcon"
                    onClick={onOpen}
                    icon={<ChatIcon />}
                    position={'absolute'}
                    right={5}
                    bottom={5}
                    size={'lg'}
                />
            </Box>
            <Drawer
                isOpen={isOpen}
                placement="right"
                size={'md'}
                onClose={onClose}
                initialFocusRef={initialFocus}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        Chat Messages
                        <Select
                            value={selectedProject}
                            variant="filled"
                            size={'lg'}
                            mt={4}
                            onChange={handleChangeSelectedProject}
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
                        width={'95%'}
                        flexDirection={'column'}
                        justifyContent="center"
                        alignItems="center"
                        m={'auto'}
                        as={'form'}
                        onSubmit={handleSubmit(handleSendMessage)}
                    >
                        <FormControl mb={4}>
                            <FormLabel>New Message</FormLabel>
                            <Textarea
                                ref={initialFocus}
                                variant={'filled'}
                                {...register('message')}
                                placeholder="Type your message here"
                                onKeyDown={(e) => handleEnterPress(e)}
                            />
                        </FormControl>
                        <Flex justifyContent="space-evenly" width={'100%'}>
                            <Button type="submit" isLoading={isSubmitting}>
                                Send
                            </Button>
                            <Button variant={'outline'} onClick={onClose}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

const ProtectedChat = ProtectedComponent(ChatDrawer);
export default ProtectedChat;
