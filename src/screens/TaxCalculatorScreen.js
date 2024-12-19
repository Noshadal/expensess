import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { BarChart } from 'react-native-chart-kit';

const TaxCalculatorScreen = () => {
  const { isDarkMode } = useTheme();
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [taxCredits, setTaxCredits] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('');
  const [taxResults, setTaxResults] = useState(null);

  useEffect(() => {
    loadTaxData();
  }, []);

  const loadTaxData = async () => {
    try {
      const taxData = await AsyncStorage.getItem('taxData');
      if (taxData) {
        const { income, deductions, taxCredits, filingStatus, state } = JSON.parse(taxData);
        setIncome(income);
        setDeductions(deductions);
        setTaxCredits(taxCredits);
        setFilingStatus(filingStatus);
        setState(state);
      }
    } catch (error) {
      console.error('Error loading tax data:', error);
    }
  };

  const saveTaxData = async () => {
    try {
      const taxData = JSON.stringify({ income, deductions, taxCredits, filingStatus, state });
      await AsyncStorage.setItem('taxData', taxData);
      Alert.alert('Success', 'Tax data saved successfully!');
    } catch (error) {
      console.error('Error saving tax data:', error);
      Alert.alert('Error', 'Failed to save tax data. Please try again.');
    }
  };

  const calculateTax = () => {
    const taxableIncome = Math.max(0, parseFloat(income) - parseFloat(deductions) || 0);
    let federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const stateTax = calculateStateTax(taxableIncome, state);
    const totalCredits = parseFloat(taxCredits) || 0;

    federalTax = Math.max(0, federalTax - totalCredits);
    const totalTax = federalTax + stateTax;
    const effectiveTaxRate = (totalTax / parseFloat(income)) * 100;

    setTaxResults({
      taxableIncome,
      federalTax,
      stateTax,
      totalTax,
      effectiveTaxRate,
    });
  };

  const calculateFederalTax = (taxableIncome, status) => {
    // This is a simplified tax calculation for demonstration purposes
    // In a real app, you'd want to use more accurate tax brackets and rates
    const brackets = {
      single: [
        { limit: 9950, rate: 0.10 },
        { limit: 40525, rate: 0.12 },
        { limit: 86375, rate: 0.22 },
        { limit: 164925, rate: 0.24 },
        { limit: 209425, rate: 0.32 },
        { limit: 523600, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
      married: [
        { limit: 19900, rate: 0.10 },
        { limit: 81050, rate: 0.12 },
        { limit: 172750, rate: 0.22 },
        { limit: 329850, rate: 0.24 },
        { limit: 418850, rate: 0.32 },
        { limit: 628300, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
    };

    const taxBrackets = brackets[status] || brackets.single;
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < taxBrackets.length; i++) {
      const { limit, rate } = taxBrackets[i];
      const prev = i > 0 ? taxBrackets[i - 1].limit : 0;
      const taxableAmount = Math.min(remainingIncome, limit - prev);
      tax += taxableAmount * rate;
      remainingIncome -= taxableAmount;
      if (remainingIncome <= 0) break;
    }

    return tax;
  };

  const calculateStateTax = (taxableIncome, state) => {
    // This is a simplified state tax calculation
    // In a real app, you'd want to use accurate state tax rates and brackets
    const stateTaxRates = {
      'CA': 0.0725,
      'NY': 0.0685,
      'TX': 0,
      'FL': 0,
      // Add more states as needed
    };
    return taxableIncome * (stateTaxRates[state] || 0);
  };

  const chartData = {
    labels: ['Taxable Income', 'Federal Tax', 'State Tax'],
    datasets: [
      {
        data: [
          taxResults?.taxableIncome || 0,
          taxResults?.federalTax || 0,
          taxResults?.stateTax || 0,
        ],
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Tax Calculator</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Annual Income:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter your annual income"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Deductions:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter your deductions"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={deductions}
          onChangeText={setDeductions}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Tax Credits:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter your tax credits"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={taxCredits}
          onChangeText={setTaxCredits}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Filing Status:</Text>
        <TouchableOpacity
          style={[styles.button, filingStatus === 'single' && styles.activeButton]}
          onPress={() => setFilingStatus('single')}
        >
          <Text style={styles.buttonText}>Single</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, filingStatus === 'married' && styles.activeButton]}
          onPress={() => setFilingStatus('married')}
        >
          <Text style={styles.buttonText}>Married</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>State:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter your state (e.g., CA, NY)"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={state}
          onChangeText={setState}
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calculateTax}>
        <Text style={styles.calculateButtonText}>Calculate Taxes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveTaxData}>
        <Text style={styles.saveButtonText}>Save Tax Data</Text>
      </TouchableOpacity>

      {taxResults && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Taxable Income: ${taxResults.taxableIncome.toFixed(2)}
          </Text>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Federal Tax: ${taxResults.federalTax.toFixed(2)}
          </Text>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            State Tax: ${taxResults.stateTax.toFixed(2)}
          </Text>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Total Tax: ${taxResults.totalTax.toFixed(2)}
          </Text>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Effective Tax Rate: {taxResults.effectiveTaxRate.toFixed(2)}%
          </Text>
        </View>
      )}

      {taxResults && (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Tax Breakdown</Text>
          <BarChart
            data={chartData}
            width={300}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
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
  resultContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  resultText: {
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
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#000000',
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

export default TaxCalculatorScreen;

