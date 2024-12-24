import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { saveExpense, getExpenses, deleteExpense, updateBudgetAndSpent, getBudgetAndSpent } from '../utils/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [quickExpense, setQuickExpense] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budget, setBudget] = useState('0');
  const [spent, setSpent] = useState('0'); // Update 1

  // Full expense form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadRecentTransactions();
    loadBudgetData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBudgetData();
    }, [loadBudgetData])
  );

  const loadRecentTransactions = useCallback(async () => {
    try {
      const expenses = await getExpenses();
      setRecentTransactions(expenses.slice(0, 5)); // Get the 5 most recent transactions
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    }
  }, []);

  const loadBudgetData = useCallback(async () => {
    try {
      const { budget: storedBudget, spent: storedSpent } = await getBudgetAndSpent();
      setBudget(storedBudget.toString());
      setSpent(storedSpent.toString());
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  }, []);

  const addQuickExpense = async () => {
    if (quickExpense.trim() !== '') {
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(quickExpense),
        category: 'Uncategorized',
        date: new Date().toISOString().split('T')[0],
        description: 'Quick expense',
      };
      await saveExpense(newExpense);
      setQuickExpense('');
      await loadRecentTransactions();
      await loadBudgetData();
    }
  };

  const handleAddExpense = async () => {
    if (amount && category) {
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category,
        date: date.toISOString().split('T')[0],
        description,
      };
      await saveExpense(newExpense);
      setAmount('');
      setCategory('');
      setDate(new Date());
      setDescription('');
      await loadRecentTransactions();
      await loadBudgetData();
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      loadRecentTransactions();
      loadBudgetData();
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Failed to delete expense');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExpense(id)}
      >
        <Icon name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderTransaction = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={[styles.transactionItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <View>
          <Text style={[styles.transactionAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
          <Text style={[styles.transactionCategory, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
            {item.category}
          </Text>
        </View>
        <Text style={[styles.transactionDate, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          {item.date}
        </Text>
      </View>
    </Swipeable>
  );


  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.quickExpenseContainer}>
        <TextInput
          style={[styles.quickExpenseInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter quick expense"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={quickExpense}
          onChangeText={setQuickExpense}
        />
        <TouchableOpacity style={styles.quickExpenseButton} onPress={addQuickExpense}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.budgetContainer}>
        <Text style={[styles.budgetLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Current Budget</Text>
        <Text style={[styles.budgetAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>${parseFloat(budget).toFixed(2)}</Text>
        <Text style={[styles.spentLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Spent</Text>
        <Text style={[styles.spentAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>${parseFloat(spent).toFixed(2)}</Text>
      </View>


      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Recent Transactions</Text>
      <FlatList
        data={recentTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        style={styles.transactionList}
      />

      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Add New Expense</Text>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
        placeholder="Amount"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
        placeholder="Category"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={[styles.dateButtonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {date.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TextInput
        style={[styles.input, styles.descriptionInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
        placeholder="Description"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  quickExpenseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  quickExpenseInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  quickExpenseButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transactionList: {
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dateButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  spentLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

