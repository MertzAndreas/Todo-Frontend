import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Select,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import IconSelector from './iconPicker';
import { BASE_URL } from '@/utils/globals';

type NewTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    taskListId: number | null;
    taskListOptions: { label: string; value: number }[];
};
const NewTaskModal = ({ isOpen, onClose, taskListId, taskListOptions }: NewTaskModalProps) => {
    const { getToken } = useAuthContext();
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        taskListId: taskListId?.toString() ?? '',
        iconId: '',
        assignedUsersEmails: '',
    });

    useEffect(() => {
        if (isOpen) {
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                taskListId: taskListId?.toString() ?? '',
                iconId: '',
                assignedUsersEmails: '',
            });
        }
    }, [isOpen, taskListId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleIconSelect = (iconId: string) => {
        setNewTask({ ...newTask, iconId: iconId });
    };

    const handleSubmit = async () => {
        const data = {
            ...newTask,
            taskListId: +newTask.taskListId,
            iconId: +newTask.iconId,
            dueDate: new Date(newTask.dueDate).toISOString(),
            assignedUsersEmails: newTask.assignedUsersEmails
                .split(',')
                .map((email) => email.trim()),
        };

        fetch(`${BASE_URL}/api/Task`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (await getToken()),
            },
            body: JSON.stringify(data),
        });

        console.log(data);
        setNewTask({
            title: '',
            description: '',
            dueDate: '',
            taskListId: '',
            iconId: '',
            assignedUsersEmails: '',
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input name="title" value={newTask.title} onChange={handleChange} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                name="description"
                                value={newTask.description}
                                onChange={handleChange}
                                maxHeight={6}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                type="datetime-local"
                                name="dueDate"
                                min={new Date().toISOString().slice(0, -8)}
                                value={newTask.dueDate}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Task List</FormLabel>
                            <Select
                                name="taskListId"
                                value={newTask.taskListId}
                                onChange={handleChange}
                            >
                                {taskListOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Task Icon</FormLabel>
                            <IconSelector onSelect={handleIconSelect} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Assigned Users Emails</FormLabel>
                            <Input
                                name="assignedUsersEmails"
                                value={newTask.assignedUsersEmails}
                                onChange={handleChange}
                                placeholder="Comma-separated emails"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Add Task
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};

export default NewTaskModal;
