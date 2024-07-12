"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import useAuthContext from "@/providers/AuthProvider";
export type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { isAuthenticated, register, redirectToDashboardIfAuthenticated } =
    useAuthContext();
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    redirectToDashboardIfAuthenticated();
  }, [isAuthenticated]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    register(form);
  }

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      height="100vh"
      bg="gray.200"
    >
      <Heading as="h1" size="2xl" mb={6}>
        Register Account
      </Heading>
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
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          p={2}
          border="1px"
          borderRadius="md"
        />
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
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          p={2}
          border="1px"
          borderRadius="md"
        />
        <Button type="submit" variant="blueButton">
          Register
        </Button>
      </Box>
      <Link href="/Account/Login">
        <Button variant="blueButton">Already have an account</Button>
      </Link>
    </Flex>
  );
};

export default Register;
