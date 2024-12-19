import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = () => {
  const { isDarkMode } = useTheme();

  const expenseData = [
    { name: 'Groceries', amount: 150, color: '#FF6384' },
    { name: 'Transport', amount: 50, color: '#36A2EB' },
    { name: 'Entertainment', amount: 100, color: '#FFCE56' },
    { name: 'Bills', amount: 200, color: '#4BC0C0' },
  ];

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Expense Overview</Text>
      <PieChart
        data={expenseData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />
      <View style={styles.categoryList}>
        {expenseData.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
            <Text style={[styles.categoryName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              {category.name}: ${category.amount}
            </Text>
          </View>
        ))}
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
  },
  categoryList: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
  },
});

export default HomeScreen;

