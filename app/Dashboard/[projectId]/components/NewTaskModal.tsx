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
    AvatarGroup,
    Avatar,
} from '@chakra-ui/react';
import useAuthContext from '@/providers/AuthProvider';
import IconSelector from './IconPicker';
import { BASE_URL } from '@/utils/globals';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import { ProjectGroupBarProps } from '@/app/Dashboard/[projectId]/components/ProjectGroupBar';

type NewTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    taskListId: number | null;
    taskListOptions: { label: string; value: number }[];
    projectMembers: ProjectMember[];
};

type CreateTask = {
    title: string;
    description: string;
    dueDate: string;
    taskListId: string;
    iconId: string;
    assignedUsersIds: string[];
};
const NewTaskModal = ({
    isOpen,
    onClose,
    taskListId,
    taskListOptions,
    projectMembers,
}: NewTaskModalProps) => {
    const { getToken } = useAuthContext();
    const [newTask, setNewTask] = useState<CreateTask>({
        title: '',
        description: '',
        dueDate: '',
        taskListId: taskListId?.toString() ?? '',
        iconId: '',
        assignedUsersIds: [],
    });

    useEffect(() => {
        if (isOpen) {
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                taskListId: taskListId?.toString() ?? '',
                iconId: '',
                assignedUsersIds: [],
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

    const setSelectedMembers = (membersId: string[] | ((prevMembers: string[]) => string[])) => {
        setNewTask((prev) => ({
            ...prev,
            assignedUsersIds:
                typeof membersId === 'function' ? membersId(prev.assignedUsersIds) : membersId,
        }));
    };

    const handleSubmit = async () => {
        const data = {
            ...newTask,
            taskListId: +newTask.taskListId,
            iconId: +newTask.iconId,
            dueDate: new Date(newTask.dueDate).toISOString(),
        };

        console.log(data);

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
            assignedUsersIds: [],
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
                            <FormLabel>Assigned Users</FormLabel>
                            <SelectableAvatars
                                projectMembers={projectMembers}
                                setSelectedMembers={setSelectedMembers}
                                selectedMembers={newTask.assignedUsersIds}
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

type SelectableAvatarsProps = {
    projectMembers: ProjectMember[];
    setSelectedMembers: (members: string[] | ((prevMembers: string[]) => string[])) => void;
    selectedMembers: string[];
};
const SelectableAvatars = ({
    projectMembers,
    setSelectedMembers,
    selectedMembers,
}: SelectableAvatarsProps) => {
    function handleMemberClick(e: React.MouseEvent<HTMLSpanElement>) {
        const memberId = e.currentTarget.id;
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
        } else {
            setSelectedMembers((prev) => [...prev, memberId]);
        }
    }

    return (
        <AvatarGroup size="md">
            {projectMembers.map((member) => (
                <Avatar
                    id={member.id}
                    onClick={(e) => handleMemberClick(e)}
                    key={member.id}
                    name={member.name}
                    title={member.name + ' - ' + member.email}
                    outline={selectedMembers.includes(member.id) ? '4px solid #384c8c' : ''}
                    p={0}
                    m={0}
                    border="none"
                    cursor="pointer"
                />
            ))}
        </AvatarGroup>
    );
};

export default NewTaskModal;
