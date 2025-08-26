"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    users: 1200,
    sales: 345,
    revenue: 15230,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 10),
        sales: prev.sales + Math.floor(Math.random() * 5),
        revenue: prev.revenue + Math.floor(Math.random() * 100),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [50, 70, 40, 90, 100, 80, 60];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav>
              <ul>
                <li
                  className={`mb-3 cursor-pointer ${
                    activeTab === "overview" ? "font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </li>
                <li
                  className={`mb-3 cursor-pointer ${
                    activeTab === "reports" ? "font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  Reports
                </li>
                <li
                  className={`mb-3 cursor-pointer ${
                    activeTab === "settings" ? "font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </li>
              </ul>
            </nav>
            <button
              className="mt-6 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setSidebarOpen(false)}
            >
              Close Sidebar
            </button>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-6">
            {!sidebarOpen && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setSidebarOpen(true)}
              >
                Open Sidebar
              </button>
            )}

            <button
              className="px-3 py-1 border rounded"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <Suspense fallback={<div>Loading...</div>}></Suspense>

          {/* Tab content */}
          {activeTab === "overview" && (
            <section>
              <Image src="/hghg.png" width={500} height={300} alt="Example" />
              <h1 className="text-2xl font-bold mb-4">Overview</h1>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <StatCard title="Users" value={stats.users} />
                <StatCard title="Sales" value={stats.sales} />
                <StatCard title="Revenue" value={`$${stats.revenue}`} />
              </div>

              {/* Simple Bar Chart */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Weekly Sales</h2>
                <BarChart data={chartData} />
              </div>
            </section>
          )}

          {activeTab === "reports" && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Reports</h1>
              <p>This is a placeholder for reports content.</p>
            </section>
          )}

          {activeTab === "settings" && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <p>Settings can go here.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col items-center">
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <svg
      width="100%"
      height="120"
      viewBox="0 0 350 120"
      className="bg-white dark:bg-gray-800 rounded shadow p-4"
    >
      {data.map((value, i) => {
        const barHeight = (value / max) * 100;
        const x = i * 40 + 10;
        return (
          <rect
            key={i}
            x={x}
            y={110 - barHeight}
            width="30"
            height={barHeight}
            fill="#3b82f6"
          />
        );
      })}
      {/* X-axis */}
      <line x1="10" y1="110" x2="290" y2="110" stroke="#999" strokeWidth={2} />
    </svg>
  );
}
