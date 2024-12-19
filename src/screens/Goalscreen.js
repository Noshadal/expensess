import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GoalsScreen = () => {
  const { isDarkMode } = useTheme();
  const [goals, setGoals] = useState([
    { id: '1', name: 'Vacation Fund', target: 1000, current: 500 },
    { id: '2', name: 'New Laptop', target: 1500, current: 750 },
    { id: '3', name: 'Emergency Fund', target: 5000, current: 2000 },
  ]);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });

  const addGoal = () => {
    if (newGoal.name.trim() !== '' && newGoal.target.trim() !== '') {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          name: newGoal.name,
          target: parseFloat(newGoal.target),
          current: 0,
        },
      ]);
      setNewGoal({ name: '', target: '' });
    }
  };

  const renderGoal = ({ item }) => {
    const progress = (item.current / item.target) * 100;
    return (
      <View style={[styles.goalItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <Text style={[styles.goalName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
        <Text style={[styles.goalProgress, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
          ${item.current} / ${item.target}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Financial Goals</Text>
      <View style={styles.addGoalContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Goal name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newGoal.name}
          onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Target amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newGoal.target}
          onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGoal}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id}
        style={styles.goalList}
      />
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
  addGoalContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  goalList: {
    flex: 1,
  },
  goalItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});

export default GoalsScreen;

