import React, { useState } from "react";

const GroupForm = () => {
  const [numberOfPeople, setNumberOfPeople] = useState();
  const [memberNames, setMemberNames] = useState([]);

  const handleNumChange = (e) => {
    const count = Math.max(0, Number(e.target.value));
    setNumberOfPeople(count);
    setMemberNames(new Array(count).fill("")); //setting the number of people , the array gets initialized with empty elements
  };

  return (
    
    <form className="bg-black text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-[100px]">
      <h1 className=" text-center text-3xl font-bold pb-[30px]">SettleMate</h1>
      <h2 className="text-xl font-semibold text-gray-300 mb-4">Create Group</h2>

      <div className="flex flex-col gap-4">
        {/* Group Name */}
        <input
          type="text"
          placeholder="Enter Group Name"
          required
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
        />

        {/* Purpose */}
        <input
          type="text"
          placeholder="Purpose (optional)"
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
        />

        {/* Number of People */}
        <input
          type="number"
          value={numberOfPeople}
          placeholder="Number of People"
          onChange={handleNumChange}
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
        />

        {/* Member Names */}
        {memberNames.map((_, id) => (
          <input
            key={id}
            type="text"
            placeholder={`Member ${id + 1}`}
            className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
          />
        ))}

        {/* Submit Button */}
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 transition">
          Create Group
        </button>
      </div>
    </form>
  );
};

export default GroupForm;
