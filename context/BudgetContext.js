import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem('budget');
      const storedSpent = await AsyncStorage.getItem('totalSpent');
      setBudget(storedBudget ? parseFloat(storedBudget) : 0);
      setSpent(storedSpent ? parseFloat(storedSpent) : 0);
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  };

  const updateBudget = async (newBudget) => {
    try {
      await AsyncStorage.setItem('budget', newBudget.toString());
      setBudget(newBudget);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const updateSpent = async (amount) => {
    try {
      const newSpent = spent + amount;
      await AsyncStorage.setItem('totalSpent', newSpent.toString());
      setSpent(newSpent);
    } catch (error) {
      console.error('Error updating spent amount:', error);
    }
  };

  return (
    <BudgetContext.Provider value={{ budget, spent, updateBudget, updateSpent, loadBudgetData }}>
      {children}
    </BudgetContext.Provider>
  );
};

