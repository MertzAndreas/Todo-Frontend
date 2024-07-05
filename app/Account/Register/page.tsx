"use client"
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useToken} from "@/app/hooks/useToken";

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const router = useRouter();
    const { validateAndRefreshToken } = useToken('','/chat');
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });


    useEffect(() => {
        validateAndRefreshToken();
    }, [validateAndRefreshToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5040/Account/register', {
                method: 'POST',
                credentials : 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            console.log(res);

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.accessToken);
                router.push('/chat');
            } else {
                console.error('Registration failed:', res.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
    
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <h1 className="text-4xl font-bold mb-6">Register Account</h1>
    <form onSubmit={handleSubmit} className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-t-lg shadow-lg">
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
