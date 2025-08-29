import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const[name , setName]= useState("")
const [email, setEmail] = useState("");

                const [password, setPassword] = useState("");
                const [error, setError] = useState("");
                const navigate = useNavigate();

                const handleSubmit = async (e) => {
                    e.preventDefault();
                    setError("");
                    try {
                        // Replace with your backend API endpoint
                        const res = await fetch("http://localhost:7777/api/auth/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name, email, password })
                        });
                        if (!res.ok) throw new Error("Invalid credentials");
                        const user = await res.json();
                        localStorage.setItem("user", JSON.stringify(user));
                        navigate("/");
                    } catch (err) {
                        setError(err.message || "Login failed");
                    }
                };

                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create an account</h2>
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4 justify-between">
                             <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 bg-white text-gray-800 w-full"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 bg-white text-gray-800 w-full"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 bg-white text-gray-800 w-full"
                                required
                            />
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <button type="submit" className="bg-gray-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition w-full">Sign in</button>
                            <p className="text-center text-gray-500 text-sm w-full">
                                Already have an account?{' '}
                                <span className="text-gray-600 font-medium">
                                    <Link to="/login" className="hover:underline">Sign in</Link>
                                </span>
                            </p>
                        </form>
                    </div>
                );
}

export default Register
