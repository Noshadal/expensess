import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const BillReminderScreen = () => {
  const { isDarkMode } = useTheme();
  const [bills, setBills] = useState([
    { id: '1', name: 'Rent', amount: 1000, dueDate: new Date(2023, 5, 1) },
    { id: '2', name: 'Electricity', amount: 80, dueDate: new Date(2023, 5, 15) },
    { id: '3', name: 'Internet', amount: 50, dueDate: new Date(2023, 5, 20) },
  ]);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: new Date() });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addBill = () => {
    if (newBill.name && newBill.amount) {
      setBills([
        ...bills,
        {
          id: Date.now().toString(),
          name: newBill.name,
          amount: parseFloat(newBill.amount),
          dueDate: newBill.dueDate,
        },
      ]);
      setNewBill({ name: '', amount: '', dueDate: new Date() });
    }
  };

  const renderBillItem = ({ item }) => (
    <View style={[styles.billItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
      <View>
        <Text style={[styles.billName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
        <Text style={[styles.billAmount, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          ${item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={[styles.billDueDate, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Due: {item.dueDate.toDateString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Bill Reminders</Text>
      <FlatList
        data={bills}
        renderItem={renderBillItem}
        keyExtractor={(item) => item.id}
        style={styles.billList}
      />
      <View style={styles.addBillContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Bill Name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newBill.name}
          onChangeText={(text) => setNewBill({ ...newBill, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newBill.amount}
          onChangeText={(text) => setNewBill({ ...newBill, amount: text })}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            {newBill.dueDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={newBill.dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setNewBill({ ...newBill, dueDate: selectedDate });
              }
            }}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={addBill}>
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
  billList: {
    flex: 1,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  billName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billAmount: {
    fontSize: 14,
  },
  billDueDate: {
    fontSize: 14,
  },
  addBillContainer: {
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
  dateButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default BillReminderScreen;

