import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PieChart, BarChart } from 'react-native-chart-kit';

const ReportsScreen = () => {
  const { isDarkMode } = useTheme();
  const [activeChart, setActiveChart] = useState('pie');

  const pieChartData = [
    { name: 'Groceries', amount: 300, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Transport', amount: 150, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Entertainment', amount: 200, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Bills', amount: 400, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [1000, 1200, 950, 1100, 1050],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.chartTypeContainer}>
        <TouchableOpacity
          style={[styles.chartTypeButton, activeChart === 'pie' && styles.activeChartType]}
          onPress={() => setActiveChart('pie')}
        >
          <Text style={styles.chartTypeText}>Category Breakdown</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chartTypeButton, activeChart === 'bar' && styles.activeChartType]}
          onPress={() => setActiveChart('bar')}
        >
          <Text style={styles.chartTypeText}>Monthly Trend</Text>
        </TouchableOpacity>
      </View>
      {activeChart === 'pie' ? (
        <PieChart
          data={pieChartData}
          width={300}
          height={200}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <BarChart
          style={styles.barChart}
          data={barChartData}
          width={300}
          height={200}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      )}
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Expense Summary
        </Text>
        <Text style={[styles.summaryText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          Total Expenses: $1,050
        </Text>
        <Text style={[styles.summaryText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          Highest Category: Bills ($400)
        </Text>
        <Text style={[styles.summaryText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          Lowest Category: Transport ($150)
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
  chartTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 8,
  },
  activeChartType: {
    backgroundColor: '#4CAF50',
  },
  chartTypeText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ReportsScreen;

