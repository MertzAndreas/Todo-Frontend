import React from 'react';
import { ProjectMember, Todo } from '@/app/Dashboard/[projectId]/page';
import { Avatar, AvatarGroup, Box, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react';
import formatDateOrCountdown from '@/utils/formatDateOrCountdown';
import { getIconById } from '@/utils/idToSVG';

type TaskProps = {
    task: Todo;
    onDragStart: (e: React.DragEvent<HTMLElement>, todoId: number) => void;
    onDragStop: () => void;
    getUserById: (id: string) => ProjectMember;
};

type AssigneesProps = {
    assignees: ProjectMember[];
};

const Assignees: React.FC<AssigneesProps> = ({ assignees }) => {
    if (assignees.length === 0) return <></>;
    if (assignees.length === 1) return <Avatar size={'sm'} name={assignees[0]?.name || ''} />;

    return (
        <AvatarGroup>
            {assignees.map((assignee, index) => (
                <Avatar size={'sm'} key={index} name={assignee.name} />
            ))}
        </AvatarGroup>
    );
};

export const Task: React.FC<TaskProps> = ({ task, onDragStart, onDragStop, getUserById }) => {
    const { title, dueDate, svg, assigneeIds } = task;

    const assignees = assigneeIds.map((assId) => getUserById(assId));

    return (
        <Card
            size="md"
            variant={'secondary'}
            draggable="true"
            cursor={'grab'}
            onDragStart={(e) => onDragStart(e, task.taskId)}
            onClick={() => console.log('Task clicked')}
            onDragEnd={onDragStop}
        >
            <CardBody>
                <Box>
                    <Heading as={'h3'} fontWeight={'500'} className={'break-all'} size="md">
                        {title}
                    </Heading>
                    <Text fontWeight={'200'}>{formatDateOrCountdown(dueDate)}</Text>
                </Box>
                <Flex flexDirection="row" justifyContent="space-between" mt={1}>
                    <Assignees assignees={assignees} />
                    <Text>{getIconById(svg, { width: '2rem', height: '2rem' })}</Text>
                </Flex>
            </CardBody>
        </Card>
    );
};
