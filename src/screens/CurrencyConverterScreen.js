import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CurrencyConverterScreen = () => {
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  const exchangeRates = {
    USD: { PKR: 283.50, AED: 3.67 },
    PKR: { USD: 0.0035, AED: 0.013 },
    AED: { USD: 0.27, PKR: 77.22 },
  };

  const convertCurrency = () => {
    if (amount && fromCurrency && toCurrency) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      const convertedAmount = parseFloat(amount) * rate;
      setResult(convertedAmount.toFixed(2));
    }
  };

  const currencies = ['USD', 'PKR', 'AED'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Currency Converter</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Amount:</Text>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Enter amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>From Currency:</Text>
        <View style={styles.currencyButtonsContainer}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                fromCurrency === currency && styles.selectedCurrency,
              ]}
              onPress={() => setFromCurrency(currency)}
            >
              <Text style={styles.currencyButtonText}>{currency}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>To Currency:</Text>
        <View style={styles.currencyButtonsContainer}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                toCurrency === currency && styles.selectedCurrency,
              ]}
              onPress={() => setToCurrency(currency)}
            >
              <Text style={styles.currencyButtonText}>{currency}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.convertButton} onPress={convertCurrency}>
        <Text style={styles.convertButtonText}>Convert</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            {amount} {fromCurrency === 'USD' ? 'USA' : fromCurrency === 'PKR' ? 'Pakistan' : 'Dubai'} = {result} {toCurrency === 'USD' ? 'USA' : toCurrency === 'PKR' ? 'Pakistan' : 'Dubai'}
          </Text>
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
  currencyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#4CAF50',
  },
  selectedCurrency: {
    backgroundColor: '#4CAF50',
  },
  currencyButtonText: {
    color: '#4CAF50',
  },
  convertButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default CurrencyConverterScreen;