import React from "react";
import {TaskListTask} from "@/app/Dashboard/[projectId]/page";
import {Card, CardBody, CardHeader, Flex, Heading, Text} from "@chakra-ui/react";
import formatDateOrCountdown from "@/utils/formatDateOrCountdown";
import {getIconById} from "@/utils/idToSVG";

type TaskProps = {
    task: TaskListTask;
    onDragStart: (e : React.DragEvent<HTMLElement>, todoId : number) => void;
};

export const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
    const { Title, Date, SVG, AssignedTo } = task;

    return (
        <Card size="md" draggable="true" onDragStart={(e) => onDragStart(e, task.Id)}>
            <CardBody>
                <Heading className={"break-all"} size="md">{Title}</Heading>
                <Text>{formatDateOrCountdown(Date)}</Text>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text>{AssignedTo.map(assignee => assignee.Initials).join(', ')}</Text>
                    <Text>{getIconById(SVG, "2rem", "2rem")}</Text>
                </Flex>
            </CardBody>
        </Card>
    );
}