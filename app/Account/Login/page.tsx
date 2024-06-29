"use client"
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useSignalR} from "@/app/SignalRContext";

type LoginForm = {
    email: string;
    password: string;
}

const Register = () => {
    const {isConnected} = useSignalR();
    const router = useRouter();
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    if(isConnected){
        router.push('/');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5040/Account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            console.log(res);

            if (res.ok) {
                const data = await res.json();
                console.log('Token received:', data.token);
                localStorage.setItem('token', data.token);
                await router.push('/chat');
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
            <form onSubmit={handleSubmit} className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-lg shadow-lg">
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
        </div>
    );
};

export default Register;
