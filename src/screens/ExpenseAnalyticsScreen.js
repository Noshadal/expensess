// src/screens/ExpenseAnalyticsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseAnalyticsScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalDaily, setTotalDaily] = useState(0);
  const [totalWeekly, setTotalWeekly] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);

  const loadExpenses = async () => {
    const storedExpenses = await AsyncStorage.getItem('expenses');
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses);
      setExpenses(parsedExpenses);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const calculateTotal = () => {
    const today = new Date();
    let daily = 0, weekly = 0, monthly = 0;

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const timeDiff = today - expenseDate;

      if (timeDiff <= 24 * 60 * 60 * 1000) daily += parseFloat(expense.amount);
      if (timeDiff <= 7 * 24 * 60 * 60 * 1000) weekly += parseFloat(expense.amount);
      if (timeDiff <= 30 * 24 * 60 * 60 * 1000) monthly += parseFloat(expense.amount);
    });

    setTotalDaily(daily);
    setTotalWeekly(weekly);
    setTotalMonthly(monthly);
  };

  useEffect(() => {
    calculateTotal();
  }, [expenses]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>

      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Daily Expenses</Text>
        <Text style={styles.cardAmount}>${totalDaily.toFixed(2)}</Text>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Weekly Expenses</Text>
        <Text style={styles.cardAmount}>${totalWeekly.toFixed(2)}</Text>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Monthly Expenses</Text>
        <Text style={styles.cardAmount}>${totalMonthly.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={loadExpenses}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#00e5ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  analyticsCard: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    color: '#fff',
  },
  cardAmount: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#00e5ff',
  },
  button: {
    backgroundColor: '#00e5ff',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExpenseAnalyticsScreen;
