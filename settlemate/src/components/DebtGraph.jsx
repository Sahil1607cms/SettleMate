import React from 'react';

const DebtGraph = ({ debtGraph, onClearDebt }) => {
  const members = Object.keys(debtGraph);
  
  // Create an array of all raw debts
  const rawDebts = [];
  
  members.forEach(from => {
    members.forEach(to => {
      if (from !== to && debtGraph[from][to] > 0.01) {
        rawDebts.push({
          from,
          to,
          amount: debtGraph[from][to]
        });
      }
    });
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">All Debt Relationships</h3>
      <div className="grid grid-cols-4 gap-2">
        <div className="font-bold">From</div>
        <div className="font-bold">To</div>
        <div className="font-bold">Amount</div>
        <div className="font-bold">Action</div>
        
        {rawDebts.map((debt, index) => (
          <React.Fragment key={index}>
            <div>{debt.from}</div>
            <div>{debt.to}</div>
            <div>₹{debt.amount.toFixed(2)}</div>
            <div>
              <button 
                className="text-blue-500 hover:text-blue-700 text-sm"
                onClick={() => onClearDebt(debt.from, debt.to)}
              >
                Settle
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DebtGraph;