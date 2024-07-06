import React from "react";
import {Todo} from "@/app/Dashboard/[projectId]/page";
import {Card, CardBody, CardHeader, Flex, Heading, Text} from "@chakra-ui/react";
import formatDateOrCountdown from "@/utils/formatDateOrCountdown";
import {getIconById} from "@/utils/idToSVG";



export const Task = ({task: {Title, DueDate, SVG, AssignedTo}}  : {task : Todo}) => {

    return (
        <Card size="md" draggable="true">
            <CardBody>
                    <Heading className={"break-all"} size="md">{Title}</Heading>
                <Text>{formatDateOrCountdown(DueDate)}</Text>
                <Flex flexDirection="row" justifyContent="space-between">
                    {/*<Text>{AssignedTo.map(assignee => assignee.Initials).join(', ')}</Text> */}
                    <Text>{getIconById(SVG, "2rem", "2rem")}</Text>
                </Flex>
            </CardBody>
        </Card>
    );
}