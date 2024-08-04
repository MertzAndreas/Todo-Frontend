import {
    Avatar,
    Box,
    Center,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import { AddIcon } from '@chakra-ui/icons';
import HubInputSearch from '@/components/HubInputSearch';
import React from 'react';

type AddGroupMemberProps = {
    projectMembers: ProjectMember[];
    addGroupMember: (userId: string) => void;
};
export const AddGroupMember = ({ projectMembers, addGroupMember }: AddGroupMemberProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const renderProjectMember = (members: ProjectMember[]) => {
        if (members.length === 0) return <Box>No members found</Box>;
        const nonProjectMembers = members.filter(
            (member) => !projectMembers.find((p) => p.id === member.id),
        );

        return (
            <TableContainer width={'100%'}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>
                                <Center>Add user</Center>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {nonProjectMembers.map((member) => {
                            return (
                                <Tr key={member.id}>
                                    <Td px={0}>
                                        <Center>
                                            <Avatar
                                                alignSelf={'start'}
                                                size={'sm'}
                                                name={member.name}
                                                p={0}
                                                m={0}
                                            />
                                        </Center>
                                    </Td>
                                    <Td>{member.name}</Td>

                                    <Td>{member.email}</Td>
                                    <Td>
                                        <Center>
                                            <IconButton
                                                aria-label="Add"
                                                icon={<AddIcon />}
                                                onClick={() => addGroupMember(member.id)}
                                                isRound
                                            />
                                        </Center>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <>
            <Avatar
                title="Add a new member"
                bg="gray.400"
                name="+"
                p={0}
                m={0}
                border="none"
                cursor="pointer"
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} size={'4xl'} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add members to project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HubInputSearch<ProjectMember>
                            url={'/kanban'}
                            hubMethod={'SearchUsers'}
                            placeholder={'Search for users by mail'}
                            render={renderProjectMember}
                            ms={500}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
