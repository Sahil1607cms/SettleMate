import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DebtGraph from "./DebtGraph";
import DebtSettlements from "./DebtSettlements";

const initializeTransaction = (members, defaultPayer = "") => ({
  payer: defaultPayer || (members.length > 0 ? members[0] : ""),
  purpose: "",
  amount: "",
  splitAmong: members.reduce((acc, member) => {
    // Initialize all members except payer
    if (member !== defaultPayer) acc[member] = 0;
    return acc;
  }, {}),
  date: new Date().toISOString().split("T")[0],
});

const calculateShares = (transaction, splitType, groupMembers) => {
  if (splitType === "equal") {
    // For equal splits, include ALL members (payer + selected members)
    const allMembers = groupMembers.filter(
      (member) => member !== transaction.payer
    );
    const totalParticipants = allMembers.length + 1; // +1 for payer
    const share = transaction.amount / totalParticipants;

    return allMembers.reduce((acc, member) => {
      acc[member] = share;
      return acc;
    }, {});
  } else return { ...transaction.splitAmong };
};

const updateDebtGraph = (currentGraph, transaction, shares) => {
  const updatedGraph = JSON.parse(JSON.stringify(currentGraph));
  const payer = transaction.payer;

  Object.entries(shares).forEach(([member, share]) => {
    if (member !== payer) {
      updatedGraph[payer][member] = (updatedGraph[payer][member] || 0) + share;
      updatedGraph[member][payer] = (updatedGraph[member][payer] || 0) - share;
    }
  });

  return updatedGraph;
};

const validateTransaction = (transaction, splitType) => {
  const amount = parseFloat(transaction.amount);
  // Is the amount a number and positive?
  if (isNaN(amount)) return "Please enter a valid amount";
  if (amount <= 0) return "Amount must be greater than 0";

  // Is there anyone selected to owe money?
  const selectedMembers = Object.keys(transaction.splitAmong);
  if (selectedMembers.length === 0)
    return "Please select at least one person who owes";

  // if there is custom split, then calculate what each member owers in splitamong
  if (splitType === "custom") {
    const totalCustomAmount = Object.values(transaction.splitAmong).reduce(
      (sum, val) => sum + val,
      0
    );

    // Check upper bound
    if (totalCustomAmount > amount + 0.01) {
      // Adding small tolerance
      return "Total owed amounts exceed transaction value";
    }

    // Check lower bound (payer can't receive money)
    const payerContribution = amount - totalCustomAmount;
    if (payerContribution < -0.01) {
      // Small tolerance
      return "Payer's contribution cannot be negative";
    }
  }

  return null;
};

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
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  //as soon as checkbox is changed the split amount is resetted to 0
  const handleSplitTypeChange = (e) => {
    const newSplitType = e.target.value;
    setSplitType(newSplitType);
    setNewTransaction((prev) => {
      if(newSplitType==="equal"){
        return{
          ...prev,
          splitAmong:groupInfo.members.reduce((acc,member)=>{
            if(member!==prev.payer) acc[member]=0;
            return acc;
          },{})
        };
      }
      else {
        return {
          ...prev,
          splitAmong:groupInfo.members.reduce((acc,member)=>{
            if(member!==prev.payer) acc[member]=prev.splitAmong[member]!==undefined?prev.splitAmong[member]:undefined;
            return acc;
          },{})
        };
      }
    });
  };

  const handleCheckboxChange = (member) => {
    if (splitType === "equal") return ;

    setNewTransaction(prev => {
      const updatedSplitAmong = { ...prev.splitAmong };
      
      // Toggle the member's presence
      if (updatedSplitAmong[member] === undefined) {
        updatedSplitAmong[member] = 0; // Add with default 0 amount
      } else {
        delete updatedSplitAmong[member]; // Remove
      }
      
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

  const handleClearDebt = (from, to) => {
    const updatedDebtGraph = { ...groupInfo.debtGraph };
    updatedDebtGraph[from][to] = 0;
    updatedDebtGraph[to][from] = 0;
    setGroupInfo({ ...groupInfo, debtGraph: updatedDebtGraph });
    localStorage.setItem(
      "currentGroup",
      JSON.stringify({
        ...groupInfo,
        debtGraph: updatedDebtGraph,
      })
    );
  };

  const addTransaction = (e) => {
    e.preventDefault();

    const error = validateTransaction(newTransaction, splitType);
    if (error) return alert(error);

    const shares = calculateShares(
      newTransaction,
      splitType,
      groupInfo.members
    );
    const updatedDebtGraph = updateDebtGraph(
      groupInfo.debtGraph,
      newTransaction,
      shares
    );

    const transactionRecord = {
      id: Date.now(),
      payer: newTransaction.payer,
      purpose: newTransaction.purpose,
      amount: parseFloat(newTransaction.amount),
      shares,
      date: newTransaction.date,
      splitType,
    };

    const updatedGroup = {
      ...groupInfo,
      debtGraph: updatedDebtGraph,
    };

    setGroupInfo(updatedGroup);
    setTransactions([...transactions, transactionRecord]);
    //resetting the newTransaction for fresh transaction
    setNewTransaction(
      initializeTransaction(groupInfo.members, newTransaction.payer)
    );
    localStorage.setItem("currentGroup", JSON.stringify(updatedGroup));
  };

  if (!newTransaction) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add transactions</h2>

      <form onSubmit={addTransaction} className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block mb-1">Who paid?</label>
          <select
            className="border p-2 rounded w-full"
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
          <label className="block mb-1">What for?</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            name="purpose"
            placeholder="e.g., Dinner, Tickets"
            value={newTransaction.purpose}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            name="amount"
            placeholder="e.g., 100"
            value={newTransaction.amount}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Split Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="splitType"
                value="equal"
                checked={splitType === "equal"} //set to true if splittype is equal(it will be checked)
                onChange={handleSplitTypeChange}
                className="form-radio"
              />
              Equal Split
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="splitType"
                value="custom"
                checked={splitType === "custom"}
                onChange={handleSplitTypeChange}
                className="form-radio"
              />
              Custom Split
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1">Who owes?</label>
          <div className="flex flex-wrap gap-4">
            {groupInfo.members.map(
              (member, index) =>
                member !== newTransaction.payer && (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newTransaction.splitAmong.hasOwnProperty(member)}
                      onChange={() => handleCheckboxChange(member)}
                      disabled={splitType==="equal"}
                    />  
                    <span>{member}</span>
                    {splitType === "custom" &&
                      newTransaction.splitAmong[member] !== undefined && (
                        <input
                          type="number"
                          className="border p-1 rounded w-20"
                          value={newTransaction.splitAmong[member]}
                          onChange={(e) =>
                            handleAmountChange(member, e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      )}
                  </div>
                )
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">When?</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
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

      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Transactions</h3>
          <ul className="space-y-2">
            {transactions.map((txn, index) => (
              <li key={index} className="border-b pb-2">
                <div>
                  <strong>{txn.payer}</strong> paid ₹{txn.amount.toFixed(2)} for{" "}
                  {txn.purpose}
                </div>
                <div className="text-sm text-gray-600">
                  {txn.splitType === "equal" ? (
                    <>
                      Split equally among all{" "}
                      {Object.keys(txn.shares).length + 1} members
                    </>
                  ) : (
                    <>
                      Custom split among: {Object.keys(txn.shares).join(", ")}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DebtGraph
        debtGraph={groupInfo.debtGraph}
        onClearDebt={handleClearDebt}
      />
      <DebtSettlements debtGraph={groupInfo.debtGraph} />
    </div>
  );
};

export default Transactions;
