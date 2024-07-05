"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToken } from "@/app/hooks/useToken";

type LoginForm = {
    email: string;
    password: string;
}

const Login = () => {
    const router = useRouter();
    const { validateAndRefreshToken } = useToken(undefined, '/chat');
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });
    useEffect(() => {
        validateAndRefreshToken();
    }, [validateAndRefreshToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5040/Account/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.accessToken);
                router.push('/chat');
            } else {
                console.error('Login failed:', res.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <h1 className="text-4xl font-bold mb-6">Login to your Account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-t-lg shadow-lg">
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
            </form>
            <Link href={"/Account/Register"}>
                <button className="p-2 bg-neutral-400 text-white rounded hover:bg-blue-600 transition-colors">Sign Up</button>
            </Link>
        </div>
    );
};

export default Login;
