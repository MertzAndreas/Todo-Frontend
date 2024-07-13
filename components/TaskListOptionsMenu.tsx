import useSignalRContext from "@/providers/SignalRProvider";
import { OptionsIcon, TrashBinIcon } from "@/utils/icons";
import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HubConnection } from "@microsoft/signalr";
import React from "react";

type TaskListOptionsMenuProps = {
  taskListId: number;
  connection: HubConnection | null;
};

export default function TaskListOptionsMenu({
  taskListId,
}: TaskListOptionsMenuProps) {
  const { connection } = useSignalRContext();

  function handleDelete(e: React.MouseEvent): void {
    e.preventDefault();
    connection
      ?.invoke("DeleteTaskList", taskListId)
      .catch((err) => console.error(err));
  }

  function handleEdit(e: React.MouseEvent): void {
    e.preventDefault();
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<OptionsIcon width={"auto"} height={"65%"} />}
        variant="outline"
      />
      <MenuList>
        <MenuItem onClick={handleDelete} icon={<TrashBinIcon />}>
          Delete task list
        </MenuItem>
        <MenuItem onClick={handleEdit} icon={<EditIcon />}>
          Edit task list
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
