"use client";

import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";

const Sidebar = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [projects, setProjects] = useState([
    { id: 1, name: "Proje İsim 1" },
    { id: 2, name: "Proje İsim 2" },
    { id: 3, name: "Proje İsim 3" },
  ]);

  const adSoyad = localStorage.getItem("Ad Soyad");
  const Email = localStorage.getItem("Email");

  const handleLogout = () => {
    localStorage.removeItem("Bearer");
    localStorage.removeItem("Ad Soyad");
    localStorage.removeItem("Email");
    window.location.reload();
  };

  const handleContentSelect = (id: any) => {
    setSelectedContent(id);
    setOpenSubMenu(id === openSubMenu ? null : id);
  };

  const handleCreateProject = () => {
    const maxId = projects.reduce(
      (max, project) => Math.max(max, project.id),
      0
    );
    const newProjectId = maxId + 1;
    const newProjectName = `Proje İsim ${newProjectId}`;

    setProjects([...projects, { id: newProjectId, name: newProjectName }]);
  };

  return (
    <main className="hidden px-2 py-5 lg:flex lg:flex-col lg:justify-between lg:px-8 lg:py-10 lg:bg-white lg:w-1/5 lg:overflow-y-auto">
      <div>
        <h2 className="text-xl">Projeler</h2>
        <div className="flex flex-col gap-3 p-4">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col">
              <div
                className={`flex justify-between items-center gap-4 p-2 rounded cursor-pointer transition-all duration-300 ${
                  selectedContent === project.id
                    ? "bg-gray-300 bg-opacity-50 text-blue-600 font-bold"
                    : "hover:bg-gray-300 hover:bg-opacity-50"
                }`}
                onClick={() => handleContentSelect(project.id)}
              >
                <h4 className="flex items-center gap-2 text-base font-bold mb-1">
                  <GoDotFill
                    className={`text-${
                      project.id === 1
                        ? "orange-600"
                        : project.id === 2
                        ? "blue-500"
                        : project.id === 3
                        ? "yellow-300"
                        : "purple-600"
                    }`}
                  />
                  {project.name}
                </h4>
                <FaChevronDown />
              </div>

              {openSubMenu === project.id && (
                <ul className="pl-6 mt-2 space-y-2">
                  <li className="flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50">
                    <a href="#" className="flex-1">
                      Overview
                    </a>
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-black rounded-full">
                      10
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50">
                    <a href="#" className="flex-1">
                      Notifications
                    </a>
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-black rounded-full">
                      10
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50">
                    <a href="#" className="flex-1">
                      Analytics
                    </a>
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-black rounded-full">
                      10
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:bg-opacity-50">
                    <a href="#" className="flex-1">
                      Reports
                    </a>
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-black rounded-full">
                      10
                    </div>
                  </li>
                </ul>
              )}
            </div>
          ))}
          <button
            className="mt-4 text-[#98A2B3] flex items-center gap-2"
            onClick={handleCreateProject}
          >
            <FaPlus /> Create New Project
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-[#101828] font-extrabold text-xs">{adSoyad}</p>
          <p className="text-[#475467] font-medium text-xs">{Email}</p>
        </div>
        <div>
          <button onClick={() => handleLogout()}>
            {" "}
            <RiCheckboxBlankCircleLine />{" "}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Sidebar;
