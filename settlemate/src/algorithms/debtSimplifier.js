/**
 * Calculates net balances for each person
 * @param {Object} debtGraph - Adjacency matrix of debts
 * @returns {Object} Net balances {person: balance}
 */
export const calculateNetBalances = (debtGraph) => {
    const people = Object.keys(debtGraph);
    return people.reduce((balances, person) => {
      balances[person] = Object.values(debtGraph[person]).reduce((sum, val) => sum + val, 0);
      return balances;
    }, {});
  };
  
  /**
   * Simplifies debts using minimum cash flow algorithm
   * @param {Object} debtGraph - Adjacency matrix of debts
   * @returns {Array} Simplified transactions [{from, to, amount}]
   */
  export const simplifyDebts = (debtGraph) => {
    const transactions = [];
    const netBalances = calculateNetBalances(debtGraph);
    const people = Object.keys(debtGraph);
  
    // Separate into creditors and debtors
    const creditors = people
      .filter(person => netBalances[person] > 0.01)
      .map(person => ({ person, amount: netBalances[person] }))
      .sort((a, b) => b.amount - a.amount);
  
    const debtors = people
      .filter(person => netBalances[person] < -0.01)
      .map(person => ({ person, amount: -netBalances[person] }))
      .sort((a, b) => b.amount - a.amount);
  
    // Greedy settlement
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