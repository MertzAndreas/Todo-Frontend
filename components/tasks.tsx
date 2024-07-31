import React from 'react';
import { Todo } from '@/app/Dashboard/[projectId]/page';
import { Avatar, AvatarGroup, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react';
import formatDateOrCountdown from '@/utils/formatDateOrCountdown';
import { getIconById } from '@/utils/idToSVG';

type TaskProps = {
    task: Todo;
    onDragStart: (e: React.DragEvent<HTMLElement>, todoId: number) => void;
};

const renderAssignees = (assignees: string[]) => {
    if (assignees.length === 0) return <></>;
    if (assignees.length === 1) return <Avatar size={'sm'} name={assignees[0]} />;

    return (
        <AvatarGroup>
            {assignees.map((assignee, index) => {
                return <Avatar size={'sm'} key={index} name={assignee} />;
            })}
        </AvatarGroup>
    );
};

export const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
    const { title, dueDate, svg, assignees } = task;

    return (
        <Card
            size="md"
            draggable="true"
            cursor={'grab'}
            onDragStart={(e) => onDragStart(e, task.taskId)}
            onClick={() => console.log('Task clicked')}
        >
            <CardBody>
                <Heading className={'break-all'} size="md">
                    {title}
                </Heading>
                <Text>{formatDateOrCountdown(dueDate)}</Text>
                <Flex flexDirection="row" justifyContent="space-between" mt={1}>
                    {renderAssignees(assignees)}
                    <Text>{getIconById(svg, { width: '2rem', height: '2rem' })}</Text>
                </Flex>
            </CardBody>
        </Card>
    );
};
