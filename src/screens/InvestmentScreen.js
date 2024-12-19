import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import { Swipeable } from 'react-native-gesture-handler';

const InvestmentsScreen = () => {
  const { isDarkMode } = useTheme();
  const [investments, setInvestments] = useState([
    { id: '1', name: 'Stock A', amount: 1000, performance: 5.2 },
    { id: '2', name: 'Bond B', amount: 2000, performance: 2.8 },
    { id: '3', name: 'ETF C', amount: 1500, performance: 4.5 },
  ]);
  const [newInvestment, setNewInvestment] = useState({ name: '', amount: '' });

  const addInvestment = () => {
    if (newInvestment.name && newInvestment.amount) {
      try {
        const amount = parseFloat(newInvestment.amount);
        if (isNaN(amount)) {
          throw new Error('Invalid amount');
        }
        setInvestments([
          ...investments,
          {
            id: Date.now().toString(),
            name: newInvestment.name,
            amount: amount,
            performance: (Math.random() * 10 - 2).toFixed(1), // Random performance between -2% and 8%
          },
        ]);
        setNewInvestment({ name: '', amount: '' });
      } catch (error) {
        Alert.alert('Error', 'Please enter a valid amount');
      }
    } else {
      Alert.alert('Error', 'Please enter both name and amount');
    }
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter(investment => investment.id !== id));
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const averagePerformance = (investments.reduce((sum, inv) => sum + parseFloat(inv.performance), 0) / investments.length).toFixed(2);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          totalInvestment * 0.98,
          totalInvestment * 1.01,
          totalInvestment * 1.03,
          totalInvestment * 1.02,
          totalInvestment * 1.05,
          totalInvestment * (1 + averagePerformance / 100),
        ],
      },
    ],
  };

  const renderInvestmentItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteInvestment(item.id)}
        >
          <Icon name="delete" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    >
      <View style={[styles.investmentItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <View>
          <Text style={[styles.investmentName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
          <Text style={[styles.investmentAmount, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
        <Text
          style={[
            styles.investmentPerformance,
            { color: parseFloat(item.performance) >= 0 ? '#4CAF50' : '#F44336' },
          ]}
        >
          {item.performance}%
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Investments</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Total Investment</Text>
          <Text style={[styles.summaryAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            ${totalInvestment.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Avg. Performance</Text>
          <Text
            style={[
              styles.summaryAmount,
              { color: parseFloat(averagePerformance) >= 0 ? '#4CAF50' : '#F44336' },
            ]}
          >
            {averagePerformance}%
          </Text>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
      <FlatList
        data={investments}
        renderItem={renderInvestmentItem}
        keyExtractor={(item) => item.id}
        style={styles.investmentList}
      />
      <View style={styles.addInvestmentContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Investment Name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newInvestment.name}
          onChangeText={(text) => setNewInvestment({ ...newInvestment, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newInvestment.amount}
          onChangeText={(text) => setNewInvestment({ ...newInvestment, amount: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addInvestment}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  investmentList: {
    flex: 1,
  },
  investmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  investmentAmount: {
    fontSize: 14,
  },
  investmentPerformance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addInvestmentContainer: {
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

export default InvestmentsScreen;