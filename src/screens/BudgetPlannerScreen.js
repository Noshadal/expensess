import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BudgetPlannerScreen = () => {
  const { isDarkMode } = useTheme();
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState('');

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const budgetData = await AsyncStorage.getItem('budgetData');
      if (budgetData) {
        const { income, expenses, savings } = JSON.parse(budgetData);
        setIncome(income);
        setExpenses(expenses);
        setSavings(savings);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  };

  const saveBudgetData = async () => {
    try {
      const budgetData = JSON.stringify({ income, expenses, savings });
      await AsyncStorage.setItem('budgetData', budgetData);
      Alert.alert('Success', 'Budget data saved successfully!');
    } catch (error) {
      console.error('Error saving budget data:', error);
      Alert.alert('Error', 'Failed to save budget data. Please try again.');
    }
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const addExpenseCategory = () => {
    setExpenses([...expenses, { id: Date.now().toString(), category: 'New Category', amount: '', percentage: '' }]);
  };

  const removeExpenseCategory = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const calculateBudget = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalSavings = parseFloat(savings) || 0;
    const availableBudget = totalIncome - totalSavings;

    let remainingBudget = availableBudget;
    const updatedExpenses = expenses.map(expense => {
      const amount = expense.percentage ? (parseFloat(expense.percentage) / 100) * availableBudget : parseFloat(expense.amount) || 0;
      remainingBudget -= amount;
      return { ...expense, calculatedAmount: amount };
    });

    setExpenses(updatedExpenses);

    if (remainingBudget < 0) {
      Alert.alert('Budget Exceeded', 'Your expenses exceed your available budget. Please adjust your allocations.');
    } else {
      Alert.alert('Budget Calculated', `Remaining budget: $${remainingBudget.toFixed(2)}`);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.calculatedAmount) || 0), 0);
  const remainingBudget = parseFloat(income) - parseFloat(savings) - totalExpenses;

  const chartData = expenses
    .filter(expense => expense.calculatedAmount && parseFloat(expense.calculatedAmount) > 0)
    .map(expense => ({
      name: expense.category,
      population: parseFloat(expense.calculatedAmount),
      color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
      legendFontColor: isDarkMode ? '#FFFFFF' : '#000000',
      legendFontSize: 12,
    }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Budget Planner</Text>
      
      <View style={styles.incomeContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Monthly Income:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter your income"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
        />
      </View>

      <View style={styles.savingsContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Savings Goal:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter savings amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={savings}
          onChangeText={setSavings}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Expenses:</Text>
      {expenses.map(expense => (
        <View key={expense.id} style={styles.expenseItem}>
          <TextInput
            style={[styles.expenseInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
            placeholder="Category"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
            value={expense.category}
            onChangeText={(text) => updateExpense(expense.id, 'category', text)}
          />
          <TextInput
            style={[styles.expenseInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
            placeholder="Amount"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
            keyboardType="numeric"
            value={expense.amount}
            onChangeText={(text) => updateExpense(expense.id, 'amount', text)}
          />
          <Text style={[styles.orText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>or</Text>
          <TextInput
            style={[styles.expenseInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
            placeholder="%"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
            keyboardType="numeric"
            value={expense.percentage}
            onChangeText={(text) => updateExpense(expense.id, 'percentage', text)}
          />
          <TouchableOpacity onPress={() => removeExpenseCategory(expense.id)}>
            <Icon name="delete" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addExpenseCategory}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.calculateButton} onPress={calculateBudget}>
        <Text style={styles.calculateButtonText}>Calculate Budget</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveBudgetData}>
        <Text style={styles.saveButtonText}>Save Budget</Text>
      </TouchableOpacity>

      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Total Expenses: ${totalExpenses.toFixed(2)}
        </Text>
        <Text style={[styles.summaryText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Remaining Budget: ${remainingBudget.toFixed(2)}
        </Text>
      </View>

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Expense Breakdown</Text>
          <PieChart
            data={chartData}
            width={300}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
    </ScrollView>
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
  incomeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 16,
    flex: 1,
  },
  expenseInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  summaryContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  savingsContainer: {
    marginBottom: 16,
  },
  orText: {
    marginHorizontal: 4,
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetPlannerScreen;

