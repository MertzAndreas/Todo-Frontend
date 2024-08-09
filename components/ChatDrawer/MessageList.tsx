import React, { useEffect, useRef } from 'react';
import { Avatar, Card, CardBody, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { getUserNameFromToken } from '@/utils/token';
import { Message } from '@/components/ChatDrawer/ChatDrawer';

interface MessageListProps {
    messages: Message[];
    selectedProject: string;
}

const ChatDrawerMessage = ({
    content,
    senderName,
    sentTime,
    currentUserName,
}: Message & { currentUserName: string }) => {
    const isUsersOwnMessage = currentUserName === senderName;

    return (
        <Card
            size={'sm'}
            variant={isUsersOwnMessage ? 'hovered' : 'secondary'}
            rounded={'xl'}
            colorScheme={'blue'}
        >
            <CardBody mx={1}>
                <HStack mb={1}>
                    <Avatar size={'sm'} name={senderName} />
                    <Heading fontSize={'md'}>{senderName}</Heading>
                </HStack>
                <Text>{content}</Text>
                <Text as="em" fontSize="sm" fontWeight={300}>
                    {new Date(sentTime).toLocaleString()}
                </Text>
            </CardBody>
        </Card>
    );
};

const MessageList: React.FC<MessageListProps> = ({ messages, selectedProject }) => {
    const currentUserName = getUserNameFromToken();
    const bottomOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (bottomOfMessagesRef.current) {
            bottomOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Stack spacing={3}>
            {[...messages]
                .filter((message) => message.projectId === selectedProject)
                .map((message, idx) => (
                    <ChatDrawerMessage
                        currentUserName={currentUserName}
                        key={idx}
                        senderId={message.senderId}
                        content={message.content}
                        sentTime={message.sentTime}
                        senderName={message.senderName}
                        projectId={message.projectId}
                    />
                ))}
            <div ref={bottomOfMessagesRef} />
        </Stack>
    );
};

export default MessageList;
