import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { LineChart } from 'react-native-chart-kit';

const ExpenseForecastScreen = () => {
  const { isDarkMode } = useTheme();
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [forecastMonths, setForecastMonths] = useState('');

  const generateForecast = () => {
    const income = parseFloat(monthlyIncome);
    const expenses = parseFloat(monthlyExpenses);
    const months = parseInt(forecastMonths);

    if (isNaN(income) || isNaN(expenses) || isNaN(months)) {
      return null;
    }

    const monthlySavings = income - expenses;
    const forecastData = Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      savings: monthlySavings * (i + 1),
    }));

    return forecastData;
  };

  const forecastData = generateForecast();

  const chartData = {
    labels: forecastData ? forecastData.map(d => `M${d.month}`) : [],
    datasets: [
      {
        data: forecastData ? forecastData.map(d => d.savings) : [],
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Expense Forecast</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Monthly Income:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter monthly income"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Monthly Expenses:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter monthly expenses"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={monthlyExpenses}
          onChangeText={setMonthlyExpenses}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Forecast Months:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter number of months"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={forecastMonths}
          onChangeText={setForecastMonths}
        />
      </View>

      {forecastData && (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Savings Forecast</Text>
          <LineChart
            data={chartData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
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
  inputContainer: {
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
  chartContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ExpenseForecastScreen;

