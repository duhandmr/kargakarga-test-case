"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  name: string;
  description: string | null;
  code: number;
  boardId: number;
  flagId: number;
  order: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedUserId: string | null;
}

interface Board {
  id: number;
  name: string;
  openAction: boolean;
  completeAction: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tasks: Task[];
}

interface ApiResponse {
  status: boolean;
  data: Board[];
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBoards = async () => {
      const token = localStorage.getItem("Bearer");

      if (!token) {
        setError("Token bulunamadı. Ana Sayfaya yönlendiriliyorsunuz.");
        router.push("/");
      }

      try {
        const response = await axios.get<ApiResponse>(
          "https://api.management.parse25proje.link/api/boards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setBoards(response.data.data);
        } else {
          setError("Failed to fetch boards");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            `An error occurred: ${err.response.data.message || err.message}`
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div key={board.id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">{board.name}</h2>
            <ul>
              {board.tasks.length > 0 ? (
                board.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="mb-2 p-2 border border-gray-300 rounded"
                  >
                    <h3 className="font-bold">{task.name}</h3>
                    <p>{task.description || "No description"}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <p>No tasks available</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
