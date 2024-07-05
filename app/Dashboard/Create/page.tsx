"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToken } from "@/app/hooks/useToken";
import {getUserIdFromToken} from "@/app/utils/isTokenExpired";

type CreateProject = {
    name: string;
    description: string;
    creatorId: string
}

const Login = () => {
    const router = useRouter();
    const { validateAndRefreshToken, getToken } = useToken("Account/Login");
    const [form, setForm] = useState<CreateProject>(() => {
        const id = getUserIdFromToken();
        if (!id) {
            console.log("Invalid token");
            router.push('/Account/Login');
        }
        return {
            name: '',
            description: '',
            creatorId: id || ''
        };
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(form.creatorId === null){
                throw new Error("Invalid token");
            }

            setForm({...form, creatorId: form.creatorId});
            const res = await fetch('http://localhost:5040/api/Project', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getToken()
                },
                body: JSON.stringify(form),
            });
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <h1 className="text-4xl font-bold mb-6">Login to your Account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-3/5 gap-4 p-8 bg-white rounded-t-lg shadow-lg">
                <input
                    type="text"
                    name="projectName"
                    placeholder="Cool Project Name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="p-2 border rounded"
                />
                <textarea
                    name="description"
                    placeholder="Project Description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Create Project
                </button>
            </form>
            <Link href={"/Dashboard"}>
                <button className="p-2 bg-neutral-400 text-white rounded hover:bg-blue-600 transition-colors">Back to dashboard</button>
            </Link>
        </div>
    );
};

export default Login;
