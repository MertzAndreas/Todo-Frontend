import { Message } from '@/components/ChatDrawer/ChatDrawer';
import { Avatar, Card, CardBody, Heading, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const ChatDrawerMessage = ({
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
