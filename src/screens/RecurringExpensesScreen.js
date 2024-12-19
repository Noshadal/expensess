import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';

const RecurringExpensesScreen = () => {
  const { isDarkMode } = useTheme();
  const [recurringExpenses, setRecurringExpenses] = useState([
    { id: '1', name: 'Rent', amount: 1000, frequency: 'Monthly' },
    { id: '2', name: 'Netflix', amount: 12.99, frequency: 'Monthly' },
    { id: '3', name: 'Gym Membership', amount: 50, frequency: 'Monthly' },
  ]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', frequency: 'Monthly' });

  const addRecurringExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setRecurringExpenses([
        ...recurringExpenses,
        {
          id: Date.now().toString(),
          name: newExpense.name,
          amount: parseFloat(newExpense.amount),
          frequency: newExpense.frequency,
        },
      ]);
      setNewExpense({ name: '', amount: '', frequency: 'Monthly' });
    }
  };

  const deleteRecurringExpense = (id) => {
    setRecurringExpenses(recurringExpenses.filter(expense => expense.id !== id));
  };

  const totalMonthlyExpenses = recurringExpenses.reduce((sum, expense) => {
    if (expense.frequency === 'Monthly') {
      return sum + expense.amount;
    } else if (expense.frequency === 'Yearly') {
      return sum + expense.amount / 12;
    }
    return sum;
  }, 0);

  const renderExpenseItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecurringExpense(item.id)}
        >
          <Icon name="delete" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    >
      <View style={[styles.expenseItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <View>
          <Text style={[styles.expenseName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
          <Text style={[styles.expenseFrequency, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
            {item.frequency}
          </Text>
        </View>
        <Text style={[styles.expenseAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          ${item.amount.toFixed(2)}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Recurring Expenses</Text>
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Total Monthly</Text>
        <Text style={[styles.summaryAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          ${totalMonthlyExpenses.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={recurringExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        style={styles.expenseList}
      />
      <View style={styles.addExpenseContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Expense Name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newExpense.name}
          onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newExpense.amount}
          onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
        />
        <TouchableOpacity
          style={styles.frequencyButton}
          onPress={() => setNewExpense({ ...newExpense, frequency: newExpense.frequency === 'Monthly' ? 'Yearly' : 'Monthly' })}
        >
          <Text style={styles.frequencyButtonText}>{newExpense.frequency}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addRecurringExpense}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
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
  expenseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseFrequency: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addExpenseContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  frequencyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: 8,
  },
  frequencyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default RecurringExpensesScreen;