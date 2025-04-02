/**
 * Initializes a new transaction object
 * @param {Array} members - List of group members
 * @param {string} defaultPayer - Default payer name
 * @returns {Object} New transaction object
 */
export const initializeTransaction = (members, defaultPayer = "") => {
    return {
      payer: defaultPayer || (members.length > 0 ? members[0] : ""),
      purpose: "",
      amount: "",
      splitAmong: members.reduce((acc, member) => {
        if (member !== defaultPayer) acc[member] = 0;
        return acc;
      }, {}),
      date: new Date().toISOString().split('T')[0],
    };
  };
  
  /**
   * Calculates shares for a transaction
   * @param {Object} transaction - Transaction data
   * @param {string} splitType - 'equal' or 'custom'
   * @returns {Object} Shares object {member: amount}
   */
  export const calculateShares = (transaction, splitType) => {
    if (splitType === "equal") {
      const selectedMembers = Object.keys(transaction.splitAmong);
      const share = transaction.amount / selectedMembers.length;
      return selectedMembers.reduce((acc, member) => {
        acc[member] = share;
        return acc;
      }, {});
    }
    return { ...transaction.splitAmong };
  };
  
  /**
   * Updates the debt graph with a new transaction
   * @param {Object} currentGraph - Current debt graph
   * @param {Object} transaction - New transaction data
   * @param {Object} shares - Calculated shares
   * @returns {Object} Updated debt graph
   */
  export const updateDebtGraph = (currentGraph, transaction, shares) => {
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
  
  /**
   * Validates transaction data
   * @param {Object} transaction - Transaction data
   * @param {string} splitType - 'equal' or 'custom'
   * @returns {string|null} Error message or null if valid
   */
  export const validateTransaction = (transaction, splitType) => {
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) return "Please enter a valid amount";
    
    const selectedMembers = Object.keys(transaction.splitAmong);
    if (selectedMembers.length === 0) return "Please select at least one person who owes";
    
    if (splitType === "custom") {
      const totalCustomAmount = Object.values(transaction.splitAmong)
        .reduce((sum, val) => sum + val, 0);
      if (Math.abs(totalCustomAmount - amount) > 0.01) {
        return `Total custom amounts (${totalCustomAmount}) must equal transaction amount (${amount})`;
      }
    }
    
    return null;
  };