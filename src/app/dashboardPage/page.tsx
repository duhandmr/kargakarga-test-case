"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

import { CiBellOn, CiCalendar, CiFilter, CiStar } from "react-icons/ci";

import Header from "../header/header";
import SideBar from "../sidebar/sideBar";
import ProjectList from "../projectList/projectList";

import Image from "next/image";

import Avatar from "../../../public/Avatar.png";
import Vector from "../../../public/Vector.png";
import TaskIcon from "../../../public/TaskIcon.png";
import RedFlag from "../../../public/RedFlag.png";
import Rectangle1 from "../../../public/Rectangle1.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { LuPlus } from "react-icons/lu";
import {
  PiDotsThreeBold,
  PiDotsThreeCircleThin,
  PiWarningCircle,
} from "react-icons/pi";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { RiCheckboxBlankCircleLine, RiHome6Line } from "react-icons/ri";
import { FaArrowsAlt } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { IoCloseOutline, IoCopyOutline } from "react-icons/io5";
import Activity from "../activity/activity";
import FilterDropdown from "../filterDropDown/filterDropDown";

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
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTabInTask, setActiveTabInTask] = useState("Attachment");
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const router = useRouter();

  const [newTask, setNewTask] = useState<
    Omit<Task, "id" | "createdAt" | "updatedAt" | "deletedAt" | "deletedUserId">
  >({
    name: "",
    description: null,
    code: 0,
    boardId: 0,
    flagId: 0,
    order: 0,
    startDate: null,
    endDate: null,
  });

  const tabs = [
    { id: 0, label: "Boards" },
    { id: 1, label: "List" },
    { id: 2, label: "Other" },
    { id: 3, label: "Other" },
    { id: 4, label: "Other" },
  ];

  const handleTabClick = (id: any) => {
    setActiveTab(id);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("Bearer");

    if (!token) {
      setError("Token bulunmadı. Lütfen giriş yapın.");
      return;
    }

    try {
      await axios.post(
        "https://api.management.parse25proje.link/api/tasks",
        { ...newTask, boardId: selectedBoard },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTask({
        name: "",
        description: null,
        code: 0,
        boardId: 0,
        flagId: 0,
        order: 0,
        startDate: null,
        endDate: null,
      });
      setShowForm(false);
      window.location.reload();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Bir hata oldu: ${err.response.data.message || err.message}`);
      } else {
        setError("Hata");
      }
    }
  };

  const handleDeleteTask = async (code: any) => {
    if (selectedTask) {
      const token = localStorage.getItem("Bearer");
      try {
        const response = await axios.delete(
          `https://api.management.parse25proje.link/api/tasks/${code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Task başarıyla silindi");
          setSelectedTask(null);
          setIsSubMenuVisible(false);
          window.location.reload();
        } else {
          throw new Error("Başarısız!!");
        }
      } catch (error) {
        console.error("Task'ı silerken bir hata oldu! :", error);
      }
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      const token = localStorage.getItem("Bearer");

      if (!token) {
        setError("Token bulunmadı. Lütfen giriş yapın.");
        router.push("/");
        return;
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
          if (response.data.data.length > 0) {
            setSelectedBoard(response.data.data[0].id);
            setNewTask((prev) => ({
              ...prev,
              boardId: response.data.data[0].id,
            }));
          }
        } else {
          setError("Failed!!");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(`Error : ${err.response.data.message || err.message}`);
        } else {
          setError("Error");
        }
      }
    };

    fetchBoards();
  }, []);

  const applyFilters = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const nameMatch = task.name
        .toLowerCase()
        .includes(filterName.toLowerCase());
      const startDateMatch = filterStartDate
        ? new Date(task.startDate || "").toISOString().split("T")[0] >=
          filterStartDate
        : true;
      const endDateMatch = filterEndDate
        ? new Date(task.endDate || "").toISOString().split("T")[0] <=
          filterEndDate
        : true;

      return nameMatch && startDateMatch && endDateMatch;
    });
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleEditClick = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("Bearer");

    if (!token) {
      setError("Token bulunmadı. Lütfen giriş yapın.");
      return;
    }

    try {
      await axios.put(
        `https://api.management.parse25proje.link/api/tasks/${selectedTask?.id}`,
        { ...selectedTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Bir hata oldu: ${err.response.data.message || err.message}`);
      } else {
        setError("Hata");
      }
    }
  };

  const handleAddBoard = () => {
    const newBoardId = boards.length
      ? Math.max(...boards.map((board) => board.id)) + 1
      : 1;
    setBoards([
      ...boards,
      {
        id: newBoardId,
        name: `Board ${newBoardId}`,
        tasks: [],
        openAction: false,
        completeAction: false,
        order: 0,
        createdAt: "",
        updatedAt: "",
        deletedAt: null,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <div className="flex flex-1 overflow-hidden">
          <ProjectList />

          <main className="flex-1 p-6 bg-gray-100 h-screen overflow-auto">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-[#145389] font-bold text-2xl">
                  Frontend Case
                </h2>
                <FilterDropdown
                  showFilter={showFilter}
                  toggleFilter={toggleFilter}
                  filterName={filterName}
                  setFilterName={setFilterName}
                  filterStartDate={filterStartDate}
                  setFilterStartDate={setFilterStartDate}
                  filterEndDate={filterEndDate}
                  setFilterEndDate={setFilterEndDate}
                />
              </div>

              <div className="bg-white my-6 border rounded-xl w-max">
                <div className="flex border-b border-gray-200 items-center">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`p-3 border-r border-gray-200 transition-all duration-300 ${
                        activeTab === tab.id
                          ? "text-[#145389] text-lg font-semibold"
                          : "text-gray-600 text-base font-normal"
                      }`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="container flex-1 overflow-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={2}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="h-full overflow-hidden"
              >
                {boards.map((board) => (
                  <SwiperSlide
                    key={board.id}
                    className="carousel-item flex-shrink-0"
                    style={{ height: "calc(100% - 20px)" }}
                    onClick={() => setSelectedBoard(board.id)}
                  >
                    <div
                      className="bg-white py-6 rounded-xl h-full flex flex-col"
                      style={{ height: "600px" }}
                    >
                      <div className="flex justify-between items-center pb-4 px-3 border-b">
                        <div className="flex items-center">
                          <h2 className="text-lg text-[#4e5ba6]">
                            {board.name.toUpperCase()}
                          </h2>
                          <span className="ml-2 flex items-center justify-center border p-2 rounded-full text-blue-600 bg-blue-100 border-blue-100 w-5 h-5">
                            {board.tasks.length}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => setShowForm(true)}>
                            <LuPlus className="text-gray-400 w-6 h-6" />
                          </button>
                          <PiDotsThreeCircleThin className="text-gray-400 w-6 h-6" />
                        </div>
                      </div>
                      <ul className="px-1 mt-2 overflow-y-auto flex-1">
                        {applyFilters(board.tasks).length > 0 ? (
                          applyFilters(board.tasks).map((task) => {
                            const taskClassName =
                              task.name === "Operasyon Birimi"
                                ? "text-[#F38744]"
                                : task.name === "Teknik Birimi"
                                ? "text-[#6941C6]"
                                : task.name === "Test ve Onay Birimi"
                                ? "text-[#067647]"
                                : "text-black";

                            return (
                              <li
                                key={task.id}
                                className="mb-2 p-2 border border-[#EAECF0] rounded-md flex items-start space-x-4 cursor-pointer"
                                onClick={() => {
                                  if (!isEditModalOpen) {
                                    setSelectedTask(task);
                                    setShowForm(false);
                                  }
                                }}
                              >
                                <div className="flex-1">
                                  <h3
                                    className={`font-bold text-xs mb-2 ${taskClassName}`}
                                  >
                                    {task.name}
                                  </h3>
                                  <p className="text-[#475467] text-sm font-semibold">
                                    {task.description}
                                  </p>
                                  <p className="flex items-center gap-2 text-[#98A2B3] font-medium text-xs my-3">
                                    <CiCalendar size={20} />
                                    {task.startDate
                                      ? new Date(
                                          task.startDate
                                        ).toLocaleDateString()
                                      : "Start Date Bulunamadı"}{" "}
                                    -{" "}
                                    {task.endDate
                                      ? new Date(
                                          task.endDate
                                        ).toLocaleDateString()
                                      : "End Date Bulunamadı"}
                                  </p>
                                  <div className="flex gap-2 text-xs">
                                    <Image src={Rectangle1} alt="Rectangle" />
                                    <p className="text-[#98A2B3]">
                                      Milestone Name
                                    </p>
                                    <Image src={RedFlag} alt="RedFlag" />
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <Image
                                    src={Avatar}
                                    alt="Avatar"
                                    width={35}
                                    height={35}
                                    className="rounded-full mt-5"
                                  />
                                </div>

                                <button
                                  className="text-xs text-blue-500 hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(task);
                                  }}
                                >
                                  Edit
                                </button>
                              </li>
                            );
                          })
                        ) : (
                          <div className="relative flex justify-center items-center h-full">
                            <div className="flex flex-col items-center justify-center">
                              <div className="relative flex justify-center items-center group">
                                <Image
                                  src={Vector}
                                  alt="New Task"
                                  className="cursor-pointer"
                                  onClick={() => setShowForm(true)}
                                />
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <p className="flex items-center text-gray-600 text-sm whitespace-nowrap">
                                    <LuPlus className="text-gray-600 w-6 h-6" />{" "}
                                    New Task
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </ul>
                    </div>
                  </SwiperSlide>
                ))}
                <SwiperSlide
                  className="carousel-item flex-shrink-0"
                  style={{ height: "calc(100% - 20px)" }}
                >
                  <div
                    className="bg-white py-6 rounded-xl h-full flex flex-col items-center justify-center cursor-pointer"
                    style={{ height: "600px" }}
                    onClick={handleAddBoard}
                  >
                    <LuPlus className="text-gray-400 w-12 h-12" />
                    <h2 className="text-lg text-[#4e5ba6] mt-2">Add Board</h2>
                  </div>
                </SwiperSlide>
              </Swiper>
              {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                    <form onSubmit={handleEditSubmit}>
                      <label className="block mb-4">
                        <span className="text-gray-700">Task Name</span>
                        <input
                          type="text"
                          value={selectedTask?.name || ""}
                          onChange={(e) =>
                            setSelectedTask((prev) =>
                              prev ? { ...prev, name: e.target.value } : prev
                            )
                          }
                          className="block w-full mt-1 p-2 border border-gray-300 rounded"
                          required
                        />
                      </label>
                      <label className="block mb-4">
                        <span className="text-gray-700">Description</span>
                        <input
                          type="text"
                          value={selectedTask?.description || ""}
                          onChange={(e) =>
                            setSelectedTask((prev) =>
                              prev
                                ? { ...prev, description: e.target.value }
                                : prev
                            )
                          }
                          className="block w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                      </label>
                      <label className="block mb-4">
                        <span className="text-gray-700">Start Date</span>
                        <input
                          type="date"
                          value={selectedTask?.startDate || ""}
                          onChange={(e) =>
                            setSelectedTask((prev) =>
                              prev
                                ? { ...prev, startDate: e.target.value }
                                : prev
                            )
                          }
                          className="block w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                      </label>
                      <label className="block mb-4">
                        <span className="text-gray-700">End Date</span>
                        <input
                          type="date"
                          value={selectedTask?.endDate || ""}
                          onChange={(e) =>
                            setSelectedTask((prev) =>
                              prev ? { ...prev, endDate: e.target.value } : prev
                            )
                          }
                          className="block w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                      </label>
                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          type="button"
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4">Create New Task</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2">
                Task Name
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </label>
              <label className="block mb-2">
                Description
                <input
                  type="text"
                  value={newTask.description || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <label className="block mb-2">
                Code
                <input
                  type="number"
                  value={newTask.code}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      code: parseInt(e.target.value),
                    }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <label className="block mb-2">
                Flag ID (1-5)
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newTask.flagId}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      flagId: parseInt(e.target.value),
                    }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </label>
              <label className="block mb-2">
                Start Date
                <input
                  type="date"
                  value={newTask.startDate || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <label className="block mb-2">
                End Date
                <input
                  type="date"
                  value={newTask.endDate || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mt-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[1440px] mx-4">
            <div className="flex flex-row justify-between items-center border-b border-[#EAECF0] p-6">
              <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-center mb-4 md:mb-0">
                <div className="hidden lg:flex gap-2 md:gap-5 items-center">
                  <IoIosArrowUp size={20} className="cursor-pointer" />
                  <IoIosArrowDown size={20} className="cursor-pointer" />
                  <RiHome6Line size={20} className="cursor-pointer" />
                  <IoIosArrowForward size={20} />
                </div>
                <div className="flex gap-1 md:gap-2 items-center text-sm md:text-base">
                  <p>25 Proje</p>
                  <IoIosArrowForward size={20} />
                  <p>Projects</p>
                  <IoIosArrowForward size={20} />
                  <p className="text-[#2083D7] font-medium">Frontend Case</p>
                </div>
                <FaArrowsAlt
                  size={15}
                  className="hidden lg:block cursor-pointer md:ml-5"
                />
              </div>

              <div className="flex gap-5 items-center">
                <div className="relative">
                  <PiDotsThreeBold
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setIsSubMenuVisible(!isSubMenuVisible)}
                  />
                  {isSubMenuVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleDeleteTask(selectedTask.code)}
                      >
                        Delete Task
                      </button>
                    </div>
                  )}
                </div>
                <GoLinkExternal size={20} className="cursor-pointer" />
                <CiStar className="cursor-pointer" />
                <button onClick={() => setSelectedTask(null)}>
                  <IoCloseOutline size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 flex flex-col lg:flex-row overflow-y-auto max-h-[80vh]">
              <div className="w-full lg:w-3/4 flex flex-col p-4">
                <div className="flex flex-col mb-4 px-4 lg:px-12">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-end">
                      <div className="flex border border-[#D0D5DD] p-2 gap-1 rounded-md items-center">
                        <RiCheckboxBlankCircleLine />
                        <p className="text-gray-500">
                          {selectedTask.startDate
                            ? new Date(
                                selectedTask.startDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </p>
                        {" - "}
                        <p className="text-gray-500">
                          {selectedTask.endDate
                            ? new Date(
                                selectedTask.endDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[#475467] font-bold text-2xl flex items-center gap-5 max-w-full lg:max-w-[655px]">
                    <Image src={TaskIcon} alt="TaskIcon" className="w-7 h-7" />
                    {selectedTask.description}
                  </p>
                  <p className="flex items-center gap-2 text-[#98A2B3] font-medium text-base mt-4 mb-16">
                    ID: <span className="underline">#{selectedTask.id}</span>{" "}
                    <IoCopyOutline />
                  </p>

                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 pl-4 lg:pl-14">
                    <div>
                      <p className="mb-2">Task Status</p>
                      <p>
                        {boards.find(
                          (board) => board.id === selectedTask.boardId
                        )?.name || "No Board"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2">Assignment</p>
                      <div className="relative flex items-center">
                        <div className="relative flex items-center">
                          <Image
                            src={Avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-white relative z-30 -ml-2 first:ml-0"
                          />
                          <Image
                            src={Avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-white relative z-20 -ml-2"
                          />
                          <Image
                            src={Avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-white relative z-10 -ml-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2">Priority</p>
                      <Image src={RedFlag} alt="RedFlag" />
                    </div>
                  </div>

                  <div>
                    <p className="text-[#475467] font-medium text-sm mb-4 mt-6">
                      Description
                    </p>
                    <span className="text-[#475467] text-xs font-normal">
                      Görevin açıklaması: Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
                    </span>
                  </div>

                  <div className="border rounded-xl mt-6">
                    <div className="flex justify-around border-b border-gray-200 bg-[#F9FAFB]">
                      {["Attachment", "Sub-Task", "Comment"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTabInTask(tab)}
                          className={`px-4 py-2 font-medium ${
                            activeTabInTask === tab
                              ? "border-b-2 border-[#145389] text-[#145389] font-extrabold"
                              : "text-[#98A2B3] font-medium text-sm"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col justify-center p-7">
                      {activeTabInTask === "Attachment" && (
                        <div className="flex flex-col justify-center items-center">
                          <div>
                            <PiWarningCircle />
                          </div>
                          <div>
                            <span className="text-[#145389] font-bold">
                              Click to upload
                            </span>{" "}
                            <span>or drag and drop</span>
                          </div>
                          <span className="text-xs">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </span>
                        </div>
                      )}
                      {activeTabInTask === "Sub-Task" && <div>Sub-Task.</div>}
                      {activeTabInTask === "Comment" && <div>Comment.</div>}
                    </div>
                  </div>
                </div>
              </div>

              <Activity />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
