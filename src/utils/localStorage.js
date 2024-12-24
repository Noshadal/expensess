import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveExpense = async (expense) => {
  try {
    const existingExpenses = await getExpenses();
    const updatedExpenses = [...existingExpenses, expense];
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    // Update budget and spent immediately
    await updateBudgetAndSpent(expense.amount);
  } catch (error) {
    console.error('Error saving expense:', error);
  }
};

export const getExpenses = async () => {
  try {
    const expenses = await AsyncStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const deleteExpense = async (id) => {
  try {
    const expenses = await getExpenses();
    const expenseToDelete = expenses.find(expense => expense.id === id);
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Update budget and spent when deleting an expense
    if (expenseToDelete) {
      await updateBudgetAndSpent(-expenseToDelete.amount);
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const getBudget = async () => {
  try {
    const budget = await AsyncStorage.getItem('budget');
    return budget ? parseFloat(budget) : 0;
  } catch (error) {
    console.error('Error getting budget:', error);
    return 0;
  }
};

export const setBudget = async (amount) => {
  try {
    await AsyncStorage.setItem('budget', amount.toString());
    return parseFloat(amount);
  } catch (error) {
    console.error('Error setting budget:', error);
    return null;
  }
};

export const getSpent = async () => {
  try {
    const spent = await AsyncStorage.getItem('spent');
    return spent ? parseFloat(spent) : 0;
  } catch (error) {
    console.error('Error getting spent amount:', error);
    return 0;
  }
};

export const updateBudgetAndSpent = async (expenseAmount) => {
  try {
    const currentSpent = await getSpent();
    const updatedSpent = currentSpent + expenseAmount;
    await AsyncStorage.setItem('spent', updatedSpent.toString());
  } catch (error) {
    console.error('Error updating budget and spent:', error);
  }
};

export const getBudgetAndSpent = async () => {
  try {
    const budget = await getBudget();
    const spent = await getSpent();
    return { budget, spent };
  } catch (error) {
    console.error('Error getting budget and spent:', error);
    return { budget: 0, spent: 0 };
  }
};

