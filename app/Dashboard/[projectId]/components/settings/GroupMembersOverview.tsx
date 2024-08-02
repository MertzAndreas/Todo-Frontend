import {
    Avatar,
    Box,
    Center,
    Flex,
    Heading,
    IconButton,
    StackDivider,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import { AddIcon } from '@chakra-ui/icons';
import { TrashBinIcon } from '@/utils/icons';

export type GroupMembersOverviewProps = {
    projectMembers: ProjectMember[];
    handleRemoveGroupMember?: (userId: string) => void;
};
const GroupMembersOverview = ({
    projectMembers,
    handleRemoveGroupMember,
}: GroupMembersOverviewProps) => {
    return (
        <>
            <Heading as={'h3'}></Heading>
            <TableContainer width={'100%'}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>
                                <Center>Remove user</Center>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {projectMembers.map((member) => {
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
                                                aria-label="Delete"
                                                bg={'red.500'}
                                                _hover={{ bg: 'red.600' }}
                                                icon={<TrashBinIcon />}
                                                onClick={() => handleRemoveGroupMember(member.id)}
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
        </>
    );
};

export default GroupMembersOverview;
