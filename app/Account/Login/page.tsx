"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToken } from '@/hooks/useToken';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import {login} from "@/app/Account/Login/login";

export type LoginForm = {
    email: string;
    password: string;
};

const Login = () => {
    const router = useRouter();
    const { validateAndRefreshToken } = useToken(undefined, '/chat');
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    const { mutate, error } = useMutation( {
        mutationFn: login,
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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        mutate({ ...form});
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <h1 className="text-4xl font-bold mb-6">Login to your Account</h1>
            <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-t-lg shadow-lg">
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
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Login
                </button>
                {error && <p className="text-red-500">Error: {error.message}</p>}
            </form>
            <Link href="/app/Account/Register">
                <button className="p-2 bg-neutral-400 text-white rounded hover:bg-blue-600 transition-colors mt-4">Sign Up</button>
            </Link>
        </div>
    );
};

export default Login;
