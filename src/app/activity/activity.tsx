"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";

type Activity = {
  id: number;
  name: string;
  avatar: string | StaticImageData;
  activity: string;
  timestamp: string;
};

const fakeActivityData: Activity[] = [
  {
    id: 1,
    name: "Candice Wu",
    avatar: require("../../../public/CandiceWu.png"),
    activity: "Invited Alisa Hester to the team",
    timestamp: "2024-08-01 10:00",
  },
  {
    id: 2,
    name: "Natali Craig",
    avatar: require("../../../public/NataliCraig.png"),
    activity: "Was added to Marketing site redesign",
    timestamp: "2024-08-01 11:00",
  },
  {
    id: 3,
    name: "Orlando Diggs",
    avatar: require("../../../public/OrlandoDiggs.png"),
    activity: "Added 3 labels to the project Marketing site redesign",
    timestamp: "2024-08-01 11:00",
  },
];

const repeatedActivityData = Array(20).fill(fakeActivityData).flat();

const ActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setActivities(repeatedActivityData);
    }, 1000);
  }, []);

  return (
    <div className="w-full lg:w-1/4 ml-0 lg:ml-6 mt-6 lg:mt-0 border-l border-[##EAECF0]">
      <div className="flex justify-between items-center p-4">
        <h4 className="text-[#145389] text-lg font-bold">Activity</h4>
        <div className="flex gap-3">
          <CiSearch />
          <IoFilterOutline />
        </div>
      </div>

      <ul className="bg-[#F3F6FD] space-y-3 overflow-y-auto h-[calc(100vh-10rem)] p-4">
        {activities.map((activity) => (
          <li
            key={`${activity.id}-${Math.random()}`}
            className="flex items-center space-x-3 py-2"
          >
            <Image
              src={activity.avatar}
              alt={activity.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">{activity.name}</p>
              <p className="text-xs text-gray-500">{activity.activity}</p>
              <p className="text-xs text-gray-400">{activity.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivitySection;
