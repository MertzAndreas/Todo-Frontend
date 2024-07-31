import {OptionsIcon, TrashBinIcon} from "@/utils/icons";
import {EditIcon} from "@chakra-ui/icons";
import {
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import React from "react";
import useHubConnection from "@/hooks/signalR/useSignalR";


type TaskListOptionsMenuProps = {
    taskListId: number;
    openModal?: () => void;
};

export default function TaskListOptionsMenu({
                                                taskListId, openModal,
                                            }: TaskListOptionsMenuProps) {

    const {invokeMethod} = useHubConnection('/kanban');
    function handleDelete(e: React.MouseEvent): void {
        e.preventDefault();
        invokeMethod("DeleteTaskList", [taskListId])
    }


    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<OptionsIcon width={"auto"} height={"65%"}/>}
                variant="outline"
            />
            <MenuList>
                <MenuItem onClick={handleDelete} icon={<TrashBinIcon/>}>
                    Delete task list
                </MenuItem>
                <MenuItem onClick={openModal} icon={<EditIcon/>}>
                    Edit task list
                </MenuItem>
            </MenuList>
        </Menu>

    );
}
