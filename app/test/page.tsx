import React from 'react';
import { Card, CardBody, IconButton, Stack, Text } from '@chakra-ui/react';
import { PlusIcon } from '@/utils/icons';

const Page = () => {
    return (
        <Stack gap={2}>
            <Card size="sm" variant={'secondary'} p={4} height="100%">
                <CardBody overflowY="auto" maxHeight="100%">
                    <IconButton
                        aria-label="Add task"
                        variant={'ghost'}
                        width={'100%'}
                        icon={<PlusIcon height={'50%'} width={'auto'} />}
                    />
                    <Stack spacing={2} overflowY="auto">
                        {Array.from({ length: 20 }, (_, index) => (
                            <Card
                                key={index}
                                size="md"
                                variant={'secondary'}
                                draggable="true"
                                cursor={'grab'}
                            >
                                <CardBody>
                                    <Text>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Aenean cursus consequat velit, in condimentum mi pulvinar
                                        sed. Quisque eu erat lobortis risus pulvinar ornare vel
                                        dapibus urna.
                                    </Text>
                                </CardBody>
                            </Card>
                        ))}
                    </Stack>
                </CardBody>
            </Card>
        </Stack>
    );
};

export default Page;
