import React from 'react';
import { List, ListItem, Text } from '@chakra-ui/react';
import { getUserNameFromToken } from '@/utils/token';
import { Message } from '@/components/ChatDrawer/ChatDrawer';

interface MessageListProps {
    messages: Message[];
    selectedProject: string;
}

const renderOwnMessage = (message: Message, index: number) => (
    <ListItem key={index} border="1px" bg="blue.100" borderColor="blue.200" borderRadius="md" p={2}>
        <Text fontSize="sm" color="darkGray">
            {message.senderName}
        </Text>
        <Text>{message.content}</Text>
        <Text as="em" fontSize="sm" color="gray.500">
            {new Date(message.sentTime).toLocaleString()}
        </Text>
    </ListItem>
);

const renderOtherMessage = (message: Message, index: number) => (
    <ListItem
        key={index}
        border="1px"
        bg="orange.100"
        borderColor="orange.200"
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
);

const MessageList: React.FC<MessageListProps> = ({ messages, selectedProject }) => {
    const currentUserName = getUserNameFromToken();

    return (
        <List spacing={3}>
            {[...messages]
                .filter((message) => message.projectId === selectedProject)
                .reverse()
                .map((message, index) =>
                    currentUserName === message.senderName
                        ? renderOwnMessage(message, index)
                        : renderOtherMessage(message, index),
                )}
        </List>
    );
};

export default MessageList;
