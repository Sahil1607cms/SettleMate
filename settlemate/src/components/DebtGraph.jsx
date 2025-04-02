import React from 'react';

const DebtGraph = ({ debtGraph, onClearDebt }) => {
  const members = Object.keys(debtGraph);
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Debt Relationships</h3>
      <div className="grid grid-cols-4 gap-2">
        <div className="font-bold">From</div>
        <div className="font-bold">To</div>
        <div className="font-bold">Amount</div>
        <div className="font-bold">Action</div>
        
        {members.flatMap(from => 
          members.map(to => {
            if (from !== to && debtGraph[from][to] > 0.01) {
              return (
                <React.Fragment key={`${from}-${to}`}>
                  <div>{from}</div>
                  <div>{to}</div>
                  <div>₹{debtGraph[from][to].toFixed(2)}</div>
                  <div>
                    <button 
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      onClick={() => onClearDebt(from, to)}
                    >
                      Clear
                    </button>
                  </div>
                </React.Fragment>
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default DebtGraph;