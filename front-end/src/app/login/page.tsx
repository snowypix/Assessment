"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5154/api/users/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      router.push("/profile");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <label className="block mb-2">
          Username
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
