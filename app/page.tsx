import Link from 'next/link';
import { Box, Button, Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';

export default function Home() {
    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={'auto'}
            width={'100%'}
        >
            <Box textAlign="center" p={8} bg="white" borderRadius="lg" shadow="lg" width="60%">
                <Heading as="h1" size="2xl" mb={6}>
                    Welcome to BaconTodo!
                </Heading>
                <Text mb={8}>Some information about the website...</Text>
                <Stack spacing={8} direction="row" justifyContent="center">
                    <Link href="/Account/Login">
                        <Button>Login</Button>
                    </Link>
                    <Link href="/Account/Register">
                        <Button variant="outline">Register</Button>
                    </Link>
                </Stack>
            </Box>
        </Flex>
    );
}
