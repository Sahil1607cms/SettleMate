import React, { useEffect, useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]); //array of objects
  const [groupInfo, setGroupInfo] = useState({ members: [] });
  const [newTransactions, setNewTransactions] = useState({
    payer: "",
    purpose: "",
    amount: "",
    splitAmong: {},
    date: "",
  });

  useEffect(() => {
    const storedGroup = localStorage.getItem("GroupInfo");
    if (storedGroup) {
      const parsedGroup = JSON.parse(storedGroup);
      setGroupInfo(parsedGroup);
    }
  }, []);

  // dynamic function for storing the transaction
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransactions((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (member) => {
    setNewTransactions((prev) => {
      const updatedSplitAmong = { ...prev.splitAmong };
      if (updatedSplitAmong[member]) delete updatedSplitAmong[member];
      else updatedSplitAmong[member] = 0;
      return { ...prev, splitAmong: updatedSplitAmong };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // console.log(groupInfo.members);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add transactions</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>Who paid?</label>
        <select
          className="border p-2 rounded"
          name="payer"
          value={
            newTransactions.payer ||
            (groupInfo.members.length > 0 ? groupInfo.members[0] : "")
          }
          onChange={handleInputChange}
          required
          id=""
        >
          {groupInfo.members.map((member, index) => (
            <option key={index} value={member}>
              {member}
            </option>
          ))}
        </select>

        <label>What for?</label>
        <input
          type="text"
          className="border p-2 rounded"
          name="purpose"
          placeholder="e.g., Dinner, Tickets"
          value={newTransactions.purpose}
          onChange={handleInputChange}
          required
        />

        <label>Amount</label>
        <input
          type="number"
          className="border p-2 rounded"
          name="amount"
          placeholder="e.g., 100"
          value={newTransactions.amount}
          onChange={handleInputChange}
          required
        />

        <label>Who owes?</label>
        <div className="flex flex-wrap gap-2">
          {groupInfo.members.map((member, index) => (
            <label key={index}>
              {" "}
              <input
                type="checkbox"
                checked={newTransactions.splitAmong.hasOwnProperty(member)}
                onChange={() => handleCheckboxChange(member)}
              />
               {member}
            </label>
          ))}
        </div>
        <label>When?</label>
        <input
          type="date"
          className="border p-2 rounded"
          name="date"
          value={newTransactions.date}
          onChange={handleInputChange}
          required
        />
      </form>
    </div>
  );
};

export default Transactions;
