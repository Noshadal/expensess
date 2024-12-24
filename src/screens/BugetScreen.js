import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getExpenses, updateBudgetAndSpent, getBudget, getSpent, setBudget, getBudgetAndSpent } from '../utils/localStorage';
import { useFocusEffect } from '@react-navigation/native';

const BudgetScreen = () => {
  const { isDarkMode } = useTheme();
  const [budget, setBudget] = useState('0');
  const [budgetInput, setBudgetInput] = useState('');
  const [spent, setSpent] = useState(0);

  const loadBudgetData = useCallback(async () => {
    try {
      const { budget: storedBudget, spent: storedSpent } = await getBudgetAndSpent();
      setBudget(storedBudget.toString());
      setSpent(storedSpent);
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  }, []);

  useEffect(() => {
    loadBudgetData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBudgetData();
    }, [loadBudgetData])
  );

  const handleSetBudget = async () => {
    if (budgetInput) {
      const newBudget = parseFloat(budgetInput);
      const updatedBudget = await setBudget(newBudget);
      if (updatedBudget !== null) {
        setBudget(updatedBudget.toString());
        setBudgetInput('');
        await loadBudgetData();
      } else {
        Alert.alert('Error', 'Failed to set budget. Please try again.');
      }
    }
  };

  const remaining = parseFloat(budget) - spent;
  const progress = budget ? (spent / parseFloat(budget)) * 100 : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Monthly Budget</Text>

      <View style={styles.budgetCircle}>
        <Text style={[styles.budgetAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>${parseFloat(budget).toFixed(2)}</Text>
      </View>

      <View style={styles.setBudgetContainer}>
        <TextInput
          style={[styles.budgetInput, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Set Budget"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={budgetInput}
          onChangeText={setBudgetInput}
        />
        <TouchableOpacity style={styles.setBudgetButton} onPress={handleSetBudget}>
          <Text style={styles.setBudgetButtonText}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
          <Icon name="attach-money" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.statLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Spent</Text>
          <Text style={[styles.statAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>${spent.toFixed(2)}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
          <Icon name="savings" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.statLabel, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Remaining</Text>
          <Text style={[styles.statAmount, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>${remaining.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {progress.toFixed(0)}% of budget used
        </Text>
      </View>
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
    textAlign: 'center',
  },
  budgetCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  budgetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  setBudgetContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  budgetInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  setBudgetButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  setBudgetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    marginVertical: 4,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BudgetScreen;

