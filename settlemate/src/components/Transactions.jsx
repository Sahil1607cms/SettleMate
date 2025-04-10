import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [groupInfo, setGroupInfo] = useState({ members: [], debtGraph: {} });
  const [newTransaction, setNewTransaction] = useState(null);
  const [splitType, setSplitType] = useState("equal");
  const navigate = useNavigate();

  useEffect(() => {
    const storedGroup = JSON.parse(localStorage.getItem("currentGroup"));
    if (storedGroup) {
      setGroupInfo(storedGroup);
      setNewTransaction(
        initializeTransaction(storedGroup.members, storedGroup.members[0])
      );
    } else navigate("/");
  }, []);

  const initializeTransaction = (members, defaultPayer = "") => ({
    // Initialize all members except payer
    payer: defaultPayer || (members.length > 0 ? members[0] : ""),
    purpose: "",
    amount: "",
    // by default the split amount will be set to 0 for the non payers
    //reduce takes two parameters accumulator and iterator
    splitAmong: members.reduce((acc, member) => {
      if (member != defaultPayer) acc[member] = 0;
      return acc;
    }, {}),
    date: new Date().toLocaleDateString("en-IN"),
  });

  const calculateShares = (transaction, splitType) => {
    //if split type is set to equal return the updated splitamount array
    if (splitType === "equal") {
      const selectedMembers = Object.keys(transaction.splitAmong);
      const totalParticipants = selectedMembers.length + 1;
      const share = transaction.amount / totalParticipants;

      return selectedMembers.reduce((acc, member) => {
        acc[member] = share;
        return acc;
      }, {});
    }
    //else if split is not equal, return the same previous splitamount array
    return { ...transaction.splitAmong };
  };

  const validateTransaction = (transaction, splitType) => {
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount)) return "Please enter a valid amount";
    if (amount <= 0) return "Amount must be greater than 0";

    const selectedMembers = Object.keys(transaction.splitAmong);
    if (selectedMembers.length == 0)
      return "Please select at least one person who owes";

    if (splitType == "custom") {
      const totalCustomAmount = Object.values(transaction.splitAmong).reduce(
        (sum, val) => sum + val,
        0
      );
      //including .01 for tolerance, floating value precision sum
      if (totalCustomAmount > amount + 0.01)
        return "Total amount exceed transaction value";

      const payerContribution = amount - totalCustomAmount;
      if (payerContribution < -0.01)
        return "Payer's contribution cant be negative ";
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSplitTypeChange = (e) => {
    const type = e.target.value;
    setSplitType(type);
    //resetting the previous split type case and resetting it to 0, actual calculation of share will be done later in calculate share
    setNewTransaction((prev) => ({
      ...prev,
      splitAmong: groupInfo.members.reduce((acc, member) => {
        acc[member] = 0;
        return acc;
      }, {}),
    }));
  };

  const handleCheckboxChange = (member) => {
    setNewTransaction((prev) => {
      const updatedSplitAmong = { ...prev.splitAmong };
      if (updatedSplitAmong[member] === undefined)
        updatedSplitAmong[member] = 0;
      else delete updatedSplitAmong[member];

      return { ...prev, splitAmong: updatedSplitAmong };
    });
  };

  const handleAmountChange = (member, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      splitAmong: {
        ...prev.splitAmong,
        [member]: parseFloat(value) || 0,
      },
    }));
  };

  const addTransaction = (e) => {
    e.preventDefault();

    const error = validateTransaction(newTransaction, splitType);
    if (error) return alert(error);
    const shares = calculateShares(newTransaction, splitType);
    const updateDebtGraph = updateDebtGraph(
      groupInfo.debtGraph,
      newTransaction,
      shares
    );
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add transactions</h2>
      {newTransaction ? (
        <form onSubmit={addTransaction} className="flex flex-col gap-4 mb-6">
          <div>
            <label htmlFor="">Who paid?</label>
            <select
              name="payer"
              value={newTransaction.payer}
              onChange={handleInputChange}
              required
            >
              {groupInfo.members.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="">What for</label>
            <input
              type="text"
              name="purpose"
              value={newTransaction.purpose}
              onChange={handleInputChange}
              required
              placeholder="Eg. Dinner"
            />
          </div>
          <div>
            <label htmlFor="">Amount</label>
            <input
              type="number"
              name="amount"
              value={newTransaction.amount}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              required
              placeholder="Eg. 1,000"
            />
          </div>

          <div>
            <label>Split Type </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="splitType"
                  value="equal"
                  checked={splitType === "equal"}
                  onChange={handleSplitTypeChange}
                  id=""
                />
                Equal
              </label>
              <label>
                <input
                  type="radio"
                  name="splitType"
                  value="custom"
                  checked={splitType === "custom"}
                  onChange={handleSplitTypeChange}
                  id=""
                />
                custom
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="">Who owes?</label>
            <div>
              {groupInfo.members.map(
                (member, index) =>
                  // not including the payer in the checkbox
                  member != newTransaction.payer && (
                    <div key={index}>
                      <input
                        type="checkbox"
                        checked={newTransaction.splitAmong.hasOwnProperty(
                          member
                        )}
                        onChange={() => handleCheckboxChange(member)}
                      />
                      <span>{member}</span>
                      {/* if the splittype is custom then display amount input fields infront of them  */}
                      {splitType === "custom" &&
                        newTransaction.splitAmong[member] != undefined && (
                          <input
                            type="number"
                            value={newTransaction.splitAmong[member]}
                            onChange={(e) =>
                              handleAmountChange(member, e.target.value)
                            }
                            min="0"
                            step="50"
                          />
                        )}
                    </div>
                  )
              )}
            </div>
          </div>

          <div>
            <label htmlFor="">When?</label>
            <input
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 transition"
        >
          Add Transaction
        </button>

        </form>
      ) : (
        <p>Loading details</p>
      )}
    </div>
  );
};

export default Transactions;
