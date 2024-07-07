import React from "react";
import {Todo} from "@/app/Dashboard/[projectId]/page";
import {Card, CardBody, Flex, Heading, Text} from "@chakra-ui/react";
import formatDateOrCountdown from "@/utils/formatDateOrCountdown";
import {getIconById} from "@/utils/idToSVG";

type TaskProps = {
    task: Todo;
    onDragStart: (e : React.DragEvent<HTMLElement>, todoId : number) => void;
};

export const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
    const { title, dueDate, svg, assignedInitials } = task;
    return (
        <Card 
            size="md" 
            draggable="true" 
            cursor={"grab"}
            onDragStart={(e) => onDragStart(e, task.taskId)}
            onClick={() => console.log('Task clicked')}
        >
            <CardBody>
                <Heading className={"break-all"} size="md">{title}</Heading>
                <Text>{formatDateOrCountdown(dueDate)}</Text>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text>{assignedInitials.map(assignee => assignee).join(', ')}</Text>
                    <Text>{getIconById(svg, "2rem", "2rem")}</Text>
                </Flex>
            </CardBody>
        </Card>
    );
}