"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api.management.parse25proje.link/api/auth/login",
        { email, password }
      );

      if (response.data.status === true) {
        localStorage.setItem("Bearer", response.data.data.token);
        localStorage.setItem("Ad Soyad", response.data.data.fullName);
        localStorage.setItem("Email", response.data.data.email);
        router.push("/dashboardPage");
        console.log(response.data.status);
      } else {
        setMessage("Invalid email or password");
      }
    } catch (err: any) {
      if (err.response) {
        setMessage(err.response.data.messages);
      } else if (err.request) {
        err.response.data.messages;
      } else {
        err.response.data.messages;
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
        >
          Login
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}
