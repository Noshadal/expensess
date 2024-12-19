import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';

const IncomeTrackerScreen = () => {
  const { isDarkMode } = useTheme();
  const [incomes, setIncomes] = useState([
    { id: '1', source: 'Salary', amount: 3000, date: '2023-05-01' },
    { id: '2', source: 'Freelance', amount: 500, date: '2023-05-15' },
    { id: '3', source: 'Investments', amount: 200, date: '2023-05-20' },
  ]);
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', date: '' });

  const addIncome = () => {
    if (newIncome.source && newIncome.amount && newIncome.date) {
      setIncomes([
        ...incomes,
        {
          id: Date.now().toString(),
          source: newIncome.source,
          amount: parseFloat(newIncome.amount),
          date: newIncome.date,
        },
      ]);
      setNewIncome({ source: '', amount: '', date: '' });
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  const chartData = incomes.map((income) => ({
    name: income.source,
    population: income.amount,
    color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
    legendFontColor: isDarkMode ? '#FFFFFF' : '#000000',
    legendFontSize: 12,
  }));

  const renderIncomeItem = ({ item }) => (
    <View style={[styles.incomeItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
      <View>
        <Text style={[styles.incomeSource, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.source}</Text>
        <Text style={[styles.incomeDate, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>{item.date}</Text>
      </View>
      <Text style={[styles.incomeAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        ${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Income Tracker</Text>
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Total Income</Text>
        <Text style={[styles.summaryAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          ${totalIncome.toFixed(2)}
        </Text>
      </View>
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
      <FlatList
        data={incomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.id}
        style={styles.incomeList}
      />
      <View style={styles.addIncomeContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Income Source"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newIncome.source}
          onChangeText={(text) => setNewIncome({ ...newIncome, source: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newIncome.amount}
          onChangeText={(text) => setNewIncome({ ...newIncome, amount: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newIncome.date}
          onChangeText={(text) => setNewIncome({ ...newIncome, date: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIncome}>
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
  incomeList: {
    flex: 1,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeDate: {
    fontSize: 14,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIncomeContainer: {
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
});

export default IncomeTrackerScreen;

