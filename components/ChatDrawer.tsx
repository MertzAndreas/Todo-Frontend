'use client'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, useDisclosure, Input, Button, Box, Heading, List, ListItem, Text, FormControl,
} from '@chakra-ui/react'
import React, {FormEvent, useEffect, useState} from "react";
import {useSignalR} from "@/hooks/useSignalR";

type Message = {
    content: string;
    sentTime: string;
    senderName: string;
};


export default function ChatDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [connection, isConnected] = useSignalR();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        if(!connection) return;

        const handleReceiveMessage = (content: string, sentTime: string, senderName: string) => {
            setMessages(prevMessages => [...prevMessages, {content, sentTime, senderName }]);
            console.log(senderName);
        };

        const handleMessageHistory = (messageHistory: Message[]) => {
            setMessages(messageHistory);
        };


        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on("MessageHistory", handleMessageHistory);

        if (isConnected) {
            connection.invoke("RetrieveMessageHistory")
                .catch(err => console.error(err));
        }

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
            connection.off("MessageHistory", handleMessageHistory);
        };
    }, [connection, isConnected]);

    const handleSendMessage = (event: FormEvent) => {
        event.preventDefault();
        if (newMessage.trim() && connection?.state === "Connected") {
            connection.invoke("PostMessage", newMessage)
                .then(() => setNewMessage(""))
                .catch(err => console.error(err));
        }
    };

    return (
        <>
        <Button colorScheme='teal' onClick={onOpen}>
            Open
        </Button>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Chat Messages</DrawerHeader>

                <DrawerBody>
                    <Box p={8} bg="gray.100" minHeight="72vh" maxHeight="72vh">
                        <Heading as="h2" fontSize="32" mb="2">Message History</Heading>
                        <Box flex="1" overflowY="scroll" mb={4}>
                            <List spacing={3} maxHeight="55vh">
                                {[...messages].reverse().map((message, index) => (
                                    <ListItem key={index} border="1px" borderColor="gray.200" borderRadius="md" p={4} bg="white">
                                        <Text fontSize="sm" color="lightgray">{message.senderName}</Text>
                                        <Text>{message.content}</Text>
                                        <Text as="em" fontSize="sm" color="gray.500">
                                            {new Date(message.sentTime).toLocaleString()}
                                        </Text>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                    <Box as="form" onSubmit={handleSendMessage} >
                        <FormControl mb={4}>
                            <Input
                                name="messageInput"
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here"
                                bg="white"
                                borderColor="gray.300"
                                _placeholder={{ color: 'gray.400' }}
                            />
                        </FormControl>
                        <Button type="submit" variant="blueButton">
                            Send
                        </Button>
                    </Box>
                </DrawerBody>

                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
        </>
    )
}