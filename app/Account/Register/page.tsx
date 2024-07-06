"use client"
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useToken} from "@/hooks/useToken";
import {useMutation} from "@tanstack/react-query";
import {register} from "@/app/Account/Register/register";

export type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const { validateAndRefreshToken } = useToken('','/chat');
    const router = useRouter();
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { mutate } = useMutation( {
        mutationFn: register,
        onSuccess: (data) => {
            localStorage.setItem('token', data.accessToken);
            router.push('/chat');
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
    });

    useEffect(() => {
        validateAndRefreshToken();
    }, [validateAndRefreshToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        mutate({...form})
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <h1 className="text-4xl font-bold mb-6">Register Account</h1>
    <form onSubmit={handleSubmit} autoComplete={"on"} className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-t-lg shadow-lg">
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="p-2 border rounded"
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
            />
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-2 border rounded"
        />
        <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="p-2 border rounded"
        />
        <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            Register
        </button>
    </form>
            <Link href={"/Account/Login"}>
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Already have an account</button>
            </Link>
</div>
    );
};

export default Register;
