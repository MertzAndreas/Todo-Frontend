import React from 'react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import GroupMembersOverview, {
    GroupMembersOverviewProps,
} from '@/app/Dashboard/[projectId]/components/settings/GroupMembersOverview';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';

type SettingsProps = {
    onClose: () => void;
    isOpen: boolean;
    projectMembers: ProjectMember[];
    handleRemoveGroupMember?: (userId: string) => void;
};
const SettingsModal = ({
    projectMembers,
    isOpen,
    onClose,
    handleRemoveGroupMember,
}: SettingsProps) => {
    return (
        <Modal isOpen={isOpen} size={'4xl'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Project settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <GroupMembersOverview
                        projectMembers={projectMembers}
                        handleRemoveGroupMember={handleRemoveGroupMember}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;
