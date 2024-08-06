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
    FormErrorMessage,
} from '@chakra-ui/react';
import IconSelector from '../IconPicker';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    newTaskFormSchema,
    NewTaskFormValues,
    newTaskFormSchemaDefaultValues,
} from './newTaskFormSchema';
import useHubConnection from '@/hooks/signalR/useSignalR';

type NewTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    taskListId: number | null;
    projectId: number;
    taskListOptions: { label: string; value: number }[];
    projectMembers: ProjectMember[];
};

const NewTaskModal = ({
    isOpen,
    onClose,
    taskListId,
    taskListOptions,
    projectId,
    projectMembers,
}: NewTaskModalProps) => {
    const { sendMessage } = useHubConnection('/kanban');
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<NewTaskFormValues>({
        resolver: zodResolver(newTaskFormSchema),
        defaultValues: {
            ...newTaskFormSchemaDefaultValues,
            taskListId: taskListId?.toString() ?? '',
            projectId: projectId,
        },
    });

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            reset({
                ...newTaskFormSchemaDefaultValues,
                taskListId: taskListId?.toString() ?? '',
                projectId: projectId,
            });
        }
    }, [isOpen, taskListId, reset]);

    useEffect(() => {
        setValue('assignedUsersIds', selectedMembers);
    }, [selectedMembers, setValue]);

    const onSubmit = async (data: NewTaskFormValues) => {
        const taskData = {
            ...data,
            projectId: projectId,
            taskListId: +data.taskListId,
            iconId: +data.iconId,
            dueDate: new Date(data.dueDate).toISOString(),
        };

        await sendMessage('CreateNewTask', [taskData, projectId]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
            <ModalOverlay>
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={!!errors.title}>
                            <FormLabel>Title</FormLabel>
                            <Input {...register('title')} />
                            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.description}>
                            <FormLabel>Description</FormLabel>
                            <Textarea {...register('description')} maxHeight={6} />
                            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.dueDate}>
                            <FormLabel>Due Date</FormLabel>
                            <Input
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, -8)}
                                {...register('dueDate')}
                            />
                            <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.taskListId}>
                            <FormLabel>Task List</FormLabel>
                            <Select {...register('taskListId')}>
                                {taskListOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.taskListId?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.iconId}>
                            <FormLabel>Task Icon</FormLabel>
                            <IconSelector setValue={setValue} />
                            <FormErrorMessage>{errors.iconId?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.assignedUsersIds}>
                            <FormLabel>Assigned Users</FormLabel>
                            <SelectableAvatars
                                projectMembers={projectMembers}
                                selectedMembers={selectedMembers}
                                setSelectedMembers={setSelectedMembers}
                            />
                            <FormErrorMessage>{errors.assignedUsersIds?.message}</FormErrorMessage>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit" isLoading={isSubmitting}>
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
