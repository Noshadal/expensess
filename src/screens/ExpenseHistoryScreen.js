import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getExpenses, saveExpenses } from '../utils/localStorage';  // Correct path to localStorage
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const ExpenseHistoryScreen = () => {
  const { isDarkMode } = useTheme(); // Dark mode state from context
  const [filter, setFilter] = useState('all'); // Filter for expense types (all, daily, weekly, monthly)
  const [expenses, setExpenses] = useState([]); // State for storing expenses

  // Fetch expenses when the screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('ExpenseHistoryScreen focused');
      loadExpenses();
    }, [])
  );

  // Load expenses from AsyncStorage
  const loadExpenses = async () => {
    console.log('Loading expenses...');
    const savedExpenses = await getExpenses();  // Call the getExpenses function
    console.log('Loaded expenses:', savedExpenses);
    setExpenses(savedExpenses);
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            const updatedExpenses = expenses.filter(expense => expense.id !== id);
            await saveExpenses(updatedExpenses); // Save updated expenses after deletion
            setExpenses(updatedExpenses); // Update the state with the new list
          }
        }
      ]
    );
  };

  // Right swipe action to delete an expense
  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteExpense(id)}
      >
        <Icon name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  // Filter expenses based on selected filter
  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    const expenseDate = new Date(expense.date);
    const today = new Date();
    if (filter === 'daily') return expenseDate.toDateString() === today.toDateString();
    if (filter === 'weekly') return expenseDate >= new Date(today.setDate(today.getDate() - 7));
    if (filter === 'monthly') return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
  });

  // Render each expense item in the list
  const renderExpenseItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={[styles.expenseItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <Text style={[styles.expenseAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          ${item.amount ? item.amount.toFixed(2) : '0.00'}
        </Text>
        <Text style={[styles.expenseCategory, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {item.category || 'Uncategorized'}
        </Text>
        <Text style={[styles.expenseDate, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          {item.date || 'No date'}
        </Text>
      </View>
    </Swipeable>
  );

  console.log('Rendering ExpenseHistoryScreen, expenses:', expenses);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Expense History</Text>
      <View style={styles.filterContainer}>
        {['all', 'daily', 'weekly', 'monthly'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterButton, filter === filterType && styles.activeFilter]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={styles.filterButtonText}>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={item => item.id.toString()}  // Ensure unique key
          style={styles.expenseList}
        />
      ) : (
        <Text style={[styles.noExpensesText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          No expenses found for the selected period.
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#DDDDDD',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  expenseList: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseCategory: {
    fontSize: 16,
  },
  expenseDate: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  noExpensesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExpenseHistoryScreen;