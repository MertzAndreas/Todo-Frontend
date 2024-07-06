    import Link from "next/link";
import {Box, Button, Flex, Heading, Stack, Text} from "@chakra-ui/react";
    import React from "react";
export default function Home() {
  return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100vh" bg="gray.200">
          <Box textAlign="center" p={8} bg="white" borderRadius="lg" shadow="lg" width="60%">
              <Heading as="h1" size="2xl" mb={6}>Welcome to BaconTodo!</Heading>
              <Text mb={8}>Some information about the website...</Text>
              <Stack spacing={8} direction='row' justifyContent='center'>
                  <Link href='/Account/Login'>
                      <Button
                          variant="blueButton"
                      >
                          Login
                      </Button>
                  </Link>
                  <Link href="/Account/Register">
                      <Button
                          variant="blueButton"
                      >
                          Register
                      </Button>
                  </Link>
              </Stack>
          </Box>
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 85,85 15,85" fill="blue" stroke="black" stroke-width="2"/>
              <line x1="50" y1="10" x2="50" y2="85" stroke="black" stroke-width="2"/>
              <line x1="15" y1="85" x2="85" y2="85" stroke="black" stroke-width="2"/>
          </svg>


      </Flex>
  );
}