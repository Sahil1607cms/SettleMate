import React from 'react';

const DebtSettlements = ({ debtGraph }) => {
  const calculateNetBalances = (debtGraph) => {
    const people = Object.keys(debtGraph);
    return people.reduce((balances, person) => {
      balances[person] = Object.values(debtGraph[person]).reduce((sum, val) => sum + val, 0);
      return balances;
    }, {});
  };

  const simplifyDebts = (debtGraph) => {
    const transactions = [];
    const netBalances = calculateNetBalances(debtGraph);
    const people = Object.keys(debtGraph);

    const creditors = people
      .filter(person => netBalances[person] > 0.01)
      .map(person => ({ person, amount: netBalances[person] }))
      .sort((a, b) => b.amount - a.amount);

    const debtors = people
      .filter(person => netBalances[person] < -0.01)
      .map(person => ({ person, amount: -netBalances[person] }))
      .sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const settleAmount = Math.min(creditor.amount, debtor.amount);
      
      if (settleAmount > 0.01) {
        transactions.push({
          from: debtor.person,
          to: creditor.person,
          amount: parseFloat(settleAmount.toFixed(2))
        });
        
        creditor.amount -= settleAmount;
        debtor.amount -= settleAmount;
      }
      
      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    return transactions;
  };

  const settlements = simplifyDebts(debtGraph);

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Simplified Settlements</h3>
      
      {settlements.length === 0 ? (
        <p className="text-gray-500">No settlements needed - all balances are clear!</p>
      ) : (
        <ul className="space-y-3">
          {settlements.map((settle, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">
                {settle.from} → {settle.to}
              </span>
              <span className="font-bold text-blue-600">
                ₹{settle.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebtSettlements;