import { OptionsIcon, TrashBinIcon } from "@/utils/icons";
import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";

type TaskListOptionsMenuProps = {
  taskListId: number;
};

export default function TaskListOptionsMenu({
  taskListId,
}: TaskListOptionsMenuProps) {
  function handleDelete(
    event: MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    throw new Error("Function not implemented.");
  }

  function handleEdit(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
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
