import { PlusIcon } from '@/utils/icons';
import {
    Button,
    Card,
    CardBody,
    Center,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    Portal,
} from '@chakra-ui/react';

import React, { FormEvent, useRef, useState } from 'react';
import useHubConnection from '@/hooks/signalR/useSignalR';

type AddTaskListProps = {
    projectId: number;
};

export default function AddTaskList({ projectId }: AddTaskListProps) {
    const [taskListName, setTaskListName] = useState('');
    const { invokeMethod } = useHubConnection('/kanban');

    const initRef = useRef(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const taskList = { name: taskListName, projectId };
        invokeMethod('CreateTaskList', [taskList]).catch(console.error);
        setTaskListName('');
    };

    return (
        <Card height={'100%'} minWidth={'25rem'} boxShadow="xl" borderRadius="md">
            <CardBody>
                <Center height={'100%'}>
                    <Popover initialFocusRef={initRef}>
                        {({ onClose }) => (
                            <>
                                <PopoverTrigger>
                                    <IconButton
                                        aria-label="Add Task List"
                                        icon={<PlusIcon />}
                                        fontSize="8rem"
                                        variant={'ghost'}
                                        size={'Just_Change_fontSize_This_Will_Adjust_To_fit'}
                                        colorScheme={'facebook'}
                                    />
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody as={'form'} onSubmit={handleSubmit}>
                                            <FormControl>
                                                <FormLabel>Title of new tasklist</FormLabel>
                                                <Input
                                                    type="text"
                                                    ref={initRef}
                                                    value={taskListName}
                                                    onChange={(e) =>
                                                        setTaskListName(e.target.value)
                                                    }
                                                />
                                            </FormControl>
                                            <PopoverFooter
                                                display={'flex'}
                                                justifyContent={'space-evenly'}
                                                width={'100%'}
                                            >
                                                <Button colorScheme="blue" type="submit">
                                                    Button
                                                </Button>
                                                <Button onClick={onClose}>Close</Button>
                                            </PopoverFooter>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </>
                        )}
                    </Popover>
                </Center>
            </CardBody>
        </Card>
    );
}
