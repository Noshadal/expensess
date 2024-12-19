import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { saveExpense } from '../utils/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddExpenseScreen = ({ navigation, route }) => {
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.scannedExpense) {
      const { amount, category, date, description } = route.params.scannedExpense;
      setAmount(amount.toString());
      setCategory(category);
      setDate(new Date(date));
      setDescription(description);
    }
  }, [route.params?.scannedExpense]);

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
    
    // Update budget
    try {
      const currentBudget = await AsyncStorage.getItem('budget');
      if (currentBudget !== null) {
        const updatedBudget = parseFloat(currentBudget) - newExpense.amount;
        await AsyncStorage.setItem('budget', updatedBudget.toString());
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }

      setAmount('');
      setCategory('');
      setDate(new Date());
      setDescription('');
      navigation.navigate('History');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Add New Expense</Text>
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
      <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('ReceiptScanner')}>
        <Text style={styles.scanButtonText}>Scan Receipt</Text>
      </TouchableOpacity>
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
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;

