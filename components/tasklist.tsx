import {Box, Flex, Heading} from "@chakra-ui/react";
import React from "react";
import {TaskList} from "@/app/Dashboard/[projectId]/page";
import {Task} from "@/components/tasks";

const Tasklist = ( {taskList: {name, tasks}} : {taskList: TaskList} ) => {
    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="start">
            <Box width={"20rem"}>
                <Heading mb="1rem" as="h1">{name}</Heading>
                {tasks.map(t => <Task task={t} key={t.Id}/>)}
            </Box>
        </Flex>
    )
}

export default Tasklist