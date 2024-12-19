import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';
import { Swipeable } from 'react-native-gesture-handler';

const DebtTrackerScreen = () => {
  const { isDarkMode } = useTheme();
  const [debts, setDebts] = useState([
    { id: '1', name: 'Credit Card A', amount: 2000, interestRate: 15.99 },
    { id: '2', name: 'Student Loan', amount: 10000, interestRate: 5.5 },
    { id: '3', name: 'Car Loan', amount: 5000, interestRate: 4.25 },
  ]);
  const [newDebt, setNewDebt] = useState({ name: '', amount: '', interestRate: '' });

  const addDebt = () => {
    if (newDebt.name && newDebt.amount && newDebt.interestRate) {
      setDebts([
        ...debts,
        {
          id: Date.now().toString(),
          name: newDebt.name,
          amount: parseFloat(newDebt.amount),
          interestRate: parseFloat(newDebt.interestRate),
        },
      ]);
      setNewDebt({ name: '', amount: '', interestRate: '' });
    }
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const chartData = debts.map((debt) => ({
    name: debt.name,
    amount: debt.amount,
    color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
    legendFontColor: isDarkMode ? '#FFFFFF' : '#000000',
    legendFontSize: 12,
  }));

  const renderDebtItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteDebt(item.id)}
        >
          <Icon name="delete" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    >
      <View style={[styles.debtItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <View>
          <Text style={[styles.debtName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
          <Text style={[styles.debtAmount, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.debtInterestRate, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {item.interestRate}%
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Debt Tracker</Text>
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Total Debt</Text>
        <Text style={[styles.summaryAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          ${totalDebt.toFixed(2)}
        </Text>
      </View>
      <PieChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <FlatList
        data={debts}
        renderItem={renderDebtItem}
        keyExtractor={(item) => item.id}
        style={styles.debtList}
      />
      <View style={styles.addDebtContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Debt Name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newDebt.name}
          onChangeText={(text) => setNewDebt({ ...newDebt, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newDebt.amount}
          onChangeText={(text) => setNewDebt({ ...newDebt, amount: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Interest Rate"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newDebt.interestRate}
          onChangeText={(text) => setNewDebt({ ...newDebt, interestRate: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addDebt}>
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
  debtList: {
    flex: 1,
  },
  debtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  debtName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debtAmount: {
    fontSize: 14,
  },
  debtInterestRate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addDebtContainer: {
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

export default DebtTrackerScreen;