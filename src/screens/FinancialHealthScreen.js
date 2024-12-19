import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getExpenses } from '../utils/localStorage';

const FinancialHealthScreen = () => {
  const { isDarkMode } = useTheme();
  const [healthScore, setHealthScore] = useState(0);
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    calculateFinancialHealth();
  }, []);

  const calculateFinancialHealth = async () => {
    const expenses = await getExpenses();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = totalExpenses / expenses.length;
    const variability = expenses.reduce((sum, expense) => sum + Math.abs(expense.amount - averageExpense), 0) / expenses.length;
    
    // This is a simplified calculation. In a real app, you'd want to consider more factors.
    const score = Math.max(0, Math.min(100, 100 - (variability / averageExpense) * 50));
    setHealthScore(score);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getHealthStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Financial Health</Text>
      <Animated.View style={[styles.scoreContainer, { transform: [{ rotate: spin }] }]}>
        <Text style={[styles.score, { color: getHealthColor(healthScore) }]}>{Math.round(healthScore)}</Text>
      </Animated.View>
      <Text style={[styles.status, { color: getHealthColor(healthScore) }]}>
        {getHealthStatus(healthScore)}
      </Text>
      <View style={styles.adviceContainer}>
        <Text style={[styles.adviceTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Tips to Improve:</Text>
        <Text style={[styles.adviceText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          • Create and stick to a budget{'\n'}
          • Reduce unnecessary expenses{'\n'}
          • Increase your savings rate{'\n'}
          • Pay off high-interest debt{'\n'}
          • Invest for the future
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  scoreContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  adviceContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default FinancialHealthScreen;

