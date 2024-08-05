import React, { useState } from 'react';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { ProjectMember } from '@/app/Dashboard/[projectId]/page';
import { AddGroupMember } from '@/app/Dashboard/[projectId]/components/AddGroupMember';

export type ProjectGroupBarProps = {
    projectMembers: ProjectMember[];
    addGroupMember: (userId: string) => void;
    selectedMembers: string[];
    setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;
};

const ProjectGroupBar = ({
    projectMembers,
    addGroupMember,
    selectedMembers,
    setSelectedMembers,
}: ProjectGroupBarProps) => {
    if (!projectMembers)
        return <AddGroupMember projectMembers={projectMembers} addGroupMember={addGroupMember} />;

    function handleMemberClick(e: React.MouseEvent<HTMLSpanElement>) {
        const memberId = e.currentTarget.id;
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
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
            <AddGroupMember projectMembers={projectMembers} addGroupMember={addGroupMember} />
        </AvatarGroup>
    );
};

export default ProjectGroupBar;
