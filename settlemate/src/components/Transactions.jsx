import React from "react";
import { useState, useEffect,useNavigate } from "react";

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
    }
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

  const validateTransaction=(transaction,splitType)=>{
    const amount=parseFloat(transaction.amount);
    if(isNaN(amount)) return "Please enter a valid amount";
    if(amount<=0) return "Amount must be greater than 0"
  }
 
  const addTransaction=(e)=>{
    e.preventDefault();

    const error=validateTransaction(newTransaction,splitType)
    if(error)
      return alert(error);
    const shares=calculateShares(newTransaction,splitType);
    const updateDebtGraph=updateDebtGraph(
      groupInfo.debtGraph,
      newTransaction,
      shares
    )
  }
  return 
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
    <h2 className="text-2xl font-bold mb-4 text-center">Add transactions</h2>
    <form onSubmit={addTransaction} className="flex flex-col gap-4 mb-6"></form>
  </div>;
  
};

export default Transactions