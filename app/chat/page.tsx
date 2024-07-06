"use client"
import React, { FormEvent, useEffect, useState } from "react";
import {useSignalR} from "@/hooks/useSignalR";
import {Box, Button, FormControl, Heading, Input, List, ListItem, Text} from "@chakra-ui/react";

type Message = {
    senderId: string;
    content: string;
    sentTime: string;
};

const Chat: React.FC = () => {
    const [connection, isConnected] = useSignalR();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        if(!connection) return;

        const handleReceiveMessage = (senderId: string, content: string, sentTime: string) => {
            setMessages(prevMessages => [...prevMessages, { senderId, content, sentTime }]);
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
        <Box p={8} bg="gray.100" minHeight="100vh">
            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>Message History</Heading>
                <List spacing={3}>
                    {messages.map((message, index) => (
                        <ListItem key={index} border="1px" borderColor="gray.200" borderRadius="md" p={4} bg="white">
                            <Text>{message.content}</Text>
                            <Text as="em" fontSize="sm" color="gray.500">
                                {new Date(message.sentTime).toLocaleString()}
                            </Text>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box as="form" onSubmit={handleSendMessage}>
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
                    <Button type="submit" colorScheme="blue">
                        Send
                    </Button>
            </Box>
        </Box>
    );
};

export default Chat;
