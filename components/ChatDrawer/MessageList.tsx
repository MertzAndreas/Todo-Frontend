import React, { useEffect, useRef } from 'react';
import { Stack } from '@chakra-ui/react';
import { getUserNameFromToken } from '@/utils/token';
import { Message } from '@/components/ChatDrawer/ChatDrawer';
import { ChatDrawerMessage } from '@/components/ChatDrawer/ChatDrawerMessage';

interface MessageListProps {
    messages: Message[];
    selectedProject: string;
}

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
