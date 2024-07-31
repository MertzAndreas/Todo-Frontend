import {
    Button,
    FormControl, FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";

type EditTaskListModalProps = {
    isOpen: boolean;
    onClose: () => void;
    taskListId: number;
};

const EditTaskListModal = ({isOpen, onClose, taskListId}: EditTaskListModalProps) => {
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        localStorage.setItem('sortSetting', event.target.value);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>Edit TaskList</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Sorting</FormLabel>
                            <Select defaultValue={localStorage.getItem('sortSetting')} onChange={handleSortChange}>
                                <option value="1">By Task ID</option>
                                <option value="2">By Title</option>
                                <option value="3">By Due Date</option>
                            </Select>
                        </FormControl>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};

export default EditTaskListModal;
