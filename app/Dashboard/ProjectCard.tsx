import React from 'react';
import {
    Avatar,
    AvatarGroup,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { DashboardProject } from '@/app/Dashboard/page';

type ProjectCardProps = {
    project: DashboardProject;
    mutate: () => void;
};
const ProjectCard = ({ project, mutate }: ProjectCardProps) => {
    return (
        <Card
            key={project.projectId}
            p={4}
            mb={4}
            borderRadius="lg"
            shadow="md"
            minW="80%"
            align={'center'}
        >
            <CardHeader>
                <Heading as="h2">{project.name}</Heading>
            </CardHeader>

            <Text>{project.description}</Text>
            <AvatarGroup spacing={'0.1'}>
                {project.projectMembers.map((member) => (
                    <Avatar size={'sm'} key={member.id} name={member.name} />
                ))}
            </AvatarGroup>

            <CardFooter>
                <ButtonGroup spacing={5}>
                    <Link href={`/Dashboard/${project.projectId}`}>
                        <Button>View Project</Button>
                    </Link>
                    <Button variant={'warning'} onClick={mutate}>
                        Delete Project
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;
