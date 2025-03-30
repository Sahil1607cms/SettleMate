import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [memberNames, setMemberNames] = useState([]);

  const navigate=useNavigate();
  //handling group name value in form
  const handleGroupName = (e) => {
    setGroupName(e.target.value);
  };

  //handling purpose value in form
  const handlePurpose = (e) => {
    setPurpose(e.target.value);
  };

  //handling total number of people in the group in form
  const handleNumChange = (e) => {
    const count = Math.max(0, Number(e.target.value)) || 0;
    setNumberOfPeople(count);
    setMemberNames(new Array(count).fill("")); //setting the number of people , the array gets initialized with empty elements
  };

  //handling each member name in form
  const handleMemberChange = (id, value) => {
    setMemberNames((prev) => {
      const updatedMembers = [...prev]; // creating copy of the array
      updatedMembers[id] = value;
      return updatedMembers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGroup={
      id:Date.now(),
      name:groupName,purpose,
      members:memberNames,
    }

    localStorage.setItem("GroupInfo",JSON.stringify(newGroup));
    navigate("/transactions");
  };

  //storing the information of all groups in object so that it can be stored in localstorage

  return (
    <form className="bg-black text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-[100px]">
      <h1 className=" text-center text-3xl font-bold pb-[30px]">SettleMate</h1>
      <h2 className="text-xl font-semibold text-gray-300 mb-4 text-center">
        Create New Group
      </h2>

      <div className="flex flex-col gap-4">
        {/* Group Name */}
        <p className="pt-2">Enter Group Name</p>
        <input
          type="text"
          placeholder="eg. Rishikesh"
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
          value={groupName}
          onChange={handleGroupName}
          required
        />

        {/* Purpose */}
        <p className="pt-2">Enter Purpose of trip</p>
        <input
          type="text"
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
          placeholder="eg. Rafting, Bungee Jumping, etc"
          value={purpose}
          onChange={handlePurpose}
          required
        />

        {/* Number of People */}
        <p className="pt-2">Enter number of members</p>
        <input
          type="number"
          className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
          placeholder="Number of People"
          value={numberOfPeople}
          onChange={handleNumChange}
          required
        />

        {/* Member Names */}
        {memberNames.map((name, index) => (
          <input
            key={`member-${index}`}
            type="text"
            className="bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
            placeholder={`Member ${index + 1}`}
            value={memberNames[index]}
            onChange={(e) => handleMemberChange(index, e.target.value)}
          />
        ))}

        {/* Submit Button */}
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 transition"
          onClick={handleSubmit}
        >
          Create Group
        </button>
      </div>
    </form>
  );
};

export default GroupForm;
