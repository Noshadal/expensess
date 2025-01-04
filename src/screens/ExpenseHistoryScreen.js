import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getExpenses, saveExpenses } from '../utils/localStorage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseHistoryScreen = () => {
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('ExpenseHistoryScreen focused');
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    try {
      console.log('Loading expenses...');
      const savedExpenses = await getExpenses();
      console.log('Loaded expenses:', savedExpenses);
      if (Array.isArray(savedExpenses)) {
        setExpenses(savedExpenses.filter(expense => expense && typeof expense === 'object'));
      } else {
        console.error('Saved expenses is not an array:', savedExpenses);
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      // Update the total spent amount
      const newTotalSpent = updatedExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      await AsyncStorage.setItem('totalSpent', newTotalSpent.toString());
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
    }
  };

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

  const filteredExpenses = expenses.filter(expense => {
    if (!expense || typeof expense !== 'object') return false;
    if (filter === 'all') return true;
    if (!expense.date) return false;
    const expenseDate = new Date(expense.date);
    if (isNaN(expenseDate.getTime())) return false;
    const today = new Date();
    if (filter === 'daily') return expenseDate.toDateString() === today.toDateString();
    if (filter === 'weekly') return expenseDate >= new Date(today.setDate(today.getDate() - 7));
    if (filter === 'monthly') return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    return false;
  });

  const renderExpenseItem = ({ item }) => {
    if (!item) return null;
    return (
      <Swipeable renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteExpense(item.id)}
        >
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      )}>
        <View style={[styles.expenseItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
          <Text style={[styles.expenseAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            ${item.amount ? parseFloat(item.amount).toFixed(2) : '0.00'}
          </Text>
          <Text style={[styles.expenseCategory, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            {item.category || 'Uncategorized'}
          </Text>
          <Text style={[styles.expenseDate, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
            {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
          </Text>
        </View>
      </Swipeable>
    );
  };

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
      <FlatList
        data={filteredExpenses || []}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item && item.id ? item.id.toString() : Math.random().toString()}
        ListEmptyComponent={() => (
          <Text style={[styles.noExpensesText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            No expenses found.
          </Text>
        )}
        style={styles.expenseList}
      />
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

