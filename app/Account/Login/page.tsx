"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import useAuthContext from "@/providers/AuthProvider";

export type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useAuthContext();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.200"
    >
      <Heading variant="basic">Login to your Account</Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        width="60%"
        p={8}
        bg="white"
        borderRadius="lg"
        shadow="lg"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          p={2}
          border="1px"
          borderRadius="md"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          p={2}
          border="1px"
          borderRadius="md"
        />
        <Button type="submit" variant="blueButton">
          Login
        </Button>
      </Box>
      <Link href="/Account/Register">
        <Button variant="greyButton">Sign Up</Button>
      </Link>
    </Flex>
  );
};

export default Login;

