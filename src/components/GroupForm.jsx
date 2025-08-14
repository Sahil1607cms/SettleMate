import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [memberNames, setMemberNames] = useState([]);

  const navigate = useNavigate();

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const handlePurpose = (e) => {
    setPurpose(e.target.value);
  };

  const handleNumChange = (e) => {
    // the max range of count will exist between 0 to the target value
    const count = Math.max(0, Number(e.target.value)) || 0;
    setNumberOfPeople(Number(e.target.value));
    // intialize empty array of size count
    setMemberNames(new Array(count).fill(""));
  };

  const handleMemberChange = (id, value) => {
    setMemberNames((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[id] = value;
      return updatedMembers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all member names are filled
    if (groupName.length === 0) {
      alert("Please enter Group Name");
      return;
    }
    if (memberNames.some((name) => name.length === 0)) {
      alert("Please enter names for all members");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      purpose,
      members: memberNames,
      // Initialize debt graph
      debtGraph: memberNames.reduce((graph, member) => {
        graph[member] = memberNames.reduce((edges, other) => {
          if (other !== member) edges[other] = 0;
          return edges;
        }, {});
        return graph;
      }, {}),
    };

    // Get existing groups or initialize empty array if none exist
    const existingGroups = JSON.parse(localStorage.getItem("groups") || "[]");

    // updating the groups info, previous + newgroup
    localStorage.setItem(
      "groups",
      JSON.stringify([...existingGroups, newGroup])
    );
    //marking and storing the current group on which we are working as "currentGro"
    localStorage.setItem("currentGroup", JSON.stringify(newGroup));

    navigate("/transactions");
  };
  const handleAddMember = () => {
    const count = numberOfPeople + 1;
    setNumberOfPeople(count);
    setMemberNames((prev) => [...prev, ""]);
  };

  const handleRemoveMember = (indexToRemove) => {
    const count = numberOfPeople - 1;
    setNumberOfPeople(count);
    setMemberNames((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <form className="bg-black text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-[100px]">
      <h1 className="text-center text-3xl font-bold pb-[30px]">SettleMate</h1>
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
          min="1"
          required
        />

        {/* Member Names */}
        <div className="flex flex-col gap-2">
          {memberNames.map((name, index) => (
            <div key={`member-${index}`} className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 outline-none"
                placeholder={`Member ${index + 1}`}
                value={name}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleRemoveMember(index)}
                disabled={memberNames.length <= 1}
                title="Remove member"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
            onClick={handleAddMember}
          >
            + Add Member
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
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
