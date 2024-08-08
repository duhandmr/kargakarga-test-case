"use-client";

import { useState } from "react";
import { CiBellOn } from "react-icons/ci";

import Avatar from "../../../public/Avatar.png";
import Image from "next/image";

export default function SideBar() {
  const [selected, setSelected] = useState<number>(0);

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  const navItems = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  return (
    <nav className="bg-[#363f72] text-white p-4 shadow-md hidden lg:flex md:flex-col justify-between">
      <div className="flex flex-col h-full justify-between py-7 items-center">
        <ul>
          {navItems.slice(0, 3).map((item) => (
            <li
              key={item.id}
              className={`mb-4 p-2 rounded cursor-pointer ${
                selected === item.id
                  ? "bg-gray-500"
                  : "hover:bg-gray-100 hover:text-black"
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <a href="#" className="text-lg flex items-center">
                <CiBellOn size={24} />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col items-center">
          {navItems.slice(3).map((item) => (
            <li
              key={item.id}
              className={`mb-4 p-2 rounded cursor-pointer ${
                selected === item.id
                  ? "bg-gray-500"
                  : "hover:bg-gray-100 hover:text-black"
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <a href="#" className="text-lg flex items-center">
                <CiBellOn size={24} />
              </a>
            </li>
          ))}
          <li>
            <Image
              src={Avatar}
              alt="Avatar"
              className="w-[50px] h-[50px] rounded-full"
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}
