"use client";

import { useState } from "react";

import { CiFilter } from "react-icons/ci";

interface FilterDropdownProps {
  showFilter: boolean;
  toggleFilter: () => void;
  filterName: string;
  setFilterName: (name: string) => void;
  filterStartDate: string;
  setFilterStartDate: (date: string) => void;
  filterEndDate: string;
  setFilterEndDate: (date: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  showFilter,
  toggleFilter,
  filterName,
  setFilterName,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
}) => {
  return (
    <div className="relative">
      <button
        onClick={toggleFilter}
        className="p-2 border rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-100"
      >
        <CiFilter />
      </button>

      {showFilter && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-xl shadow-lg z-10">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Filter Tasks</h3>
            <form className="flex flex-col gap-4">
              <label>
                Task Name
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <label>
                Start Date
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
              <label>
                End Date
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </label>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
