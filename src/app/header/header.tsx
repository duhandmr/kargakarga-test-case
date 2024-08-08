"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import logo from "../../../public/logo.jpeg";

import { GoDotFill } from "react-icons/go";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { CiBellOn } from "react-icons/ci";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const adSoyad = localStorage.getItem("Ad Soyad") || "Ad Soyad Bulunamadı";
  const email = localStorage.getItem("Email") || "Email Bulunamadı";

  const router = useRouter();

  const handleContentSelect = (id: any) => {
    if (selectedContent === id) {
      setSelectedContent(null);
      setOpenSubMenu(null);
    } else {
      setSelectedContent(id);
      setOpenSubMenu(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Bearer");
    router.push("/");
    window.location.reload();
  };

  return (
    <header className="relative flex justify-between items-center lg:px-5 bg-white text-gray-800 p-4 shadow-md border-b">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-[#145389]">kargakarga</h1>
        <div className="hidden lg:flex items-center gap-4">
          <CiBellOn size={24} className="text-gray-400" />
          <CiBellOn size={24} className="text-gray-400" />
          <Image src={logo} alt="25Logo" width={50} height={50} />
        </div>

        <div className="lg:hidden flex items-center">
          <IoMenu
            size={24}
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-400"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 lg:hidden">
          <div className="flex justify-end p-4">
            <IoClose
              size={24}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400"
            />
          </div>
          <main className="flex flex-col h-full">
            <div className="flex flex-col flex-grow overflow-y-auto px-2 py-5 bg-white">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold mb-4">Projeler</h2>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="flex flex-col">
                      <div
                        className={`flex justify-between items-center gap-4 p-2 rounded cursor-pointer transition-all duration-300 ${
                          selectedContent === id
                            ? "bg-gray-300 bg-opacity-50 text-blue-600 font-bold"
                            : "hover:bg-gray-300 hover:bg-opacity-50"
                        }`}
                        onClick={() => handleContentSelect(id)}
                      >
                        <h4 className="flex items-center gap-2 text-base font-bold mb-1">
                          <GoDotFill
                            className={`text-${
                              id === 1
                                ? "orange-600"
                                : id === 2
                                ? "blue-500"
                                : id === 3
                                ? "yellow-300"
                                : "purple-600"
                            }`}
                          />
                          Proje İsim {id}
                        </h4>
                        <FaChevronDown />
                      </div>

                      {openSubMenu === id && (
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
                </div>
                <div className="flex justify-between px-4 py-2 border-t bg-white">
                  <div>
                    <p className="text-[#101828] font-extrabold text-xs">
                      {adSoyad}
                    </p>
                    <p className="text-[#475467] font-medium text-xs">
                      {email}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleLogout()}
                      className="text-gray-400"
                    >
                      <RiCheckboxBlankCircleLine size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </header>
  );
}
