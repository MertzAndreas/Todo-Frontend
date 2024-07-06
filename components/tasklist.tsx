import {Box, Flex, Heading} from "@chakra-ui/react";
import React from "react";
import {TaskList} from "@/app/Dashboard/[projectId]/page";
import {Task} from "@/components/tasks";

const Tasklist = ( {taskList: {id, name, tasks}} : {taskList: TaskList} ) => {
    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="start">
            <Box >
                <Heading variant="basic">{name}</Heading>
                {tasks.map(t => <Task task={t}/>)}
            </Box>
        </Flex>
    )
}

export default Tasklist