import { OptionsIcon, TrashBinIcon } from '@/utils/icons';
import { EditIcon } from '@chakra-ui/icons';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import useHubConnection from '@/hooks/signalR/useSignalR';

type TaskListOptionsMenuProps = {
    taskListId: number;
    openModal?: () => void;
};

export default function TaskListOptionsMenu({ taskListId, openModal }: TaskListOptionsMenuProps) {
    const { invokeMethod } = useHubConnection('/kanban');

    const iconColor = useColorModeValue('black', 'gray.100');

    function handleDelete(e) {
        e.preventDefault();
        invokeMethod('DeleteTaskList', [taskListId]);
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<OptionsIcon width={'auto'} height={'65%'} fill={iconColor} />}
                variant="ghost"
            />
            <MenuList>
                <MenuItem onClick={handleDelete} icon={<TrashBinIcon />}>
                    Delete task list
                </MenuItem>
                <MenuItem onClick={openModal} icon={<EditIcon />}>
                    Edit task list
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
