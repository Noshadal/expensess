import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SavingsTrackerScreen = () => {
  const { isDarkMode } = useTheme();
  const [savings, setSavings] = useState([
    { id: '1', name: 'Emergency Fund', target: 5000, current: 2000 },
    { id: '2', name: 'Vacation', target: 3000, current: 1500 },
    { id: '3', name: 'New Car', target: 15000, current: 5000 },
  ]);
  const [newSaving, setNewSaving] = useState({ name: '', target: '', current: '' });

  const addSaving = () => {
    if (newSaving.name && newSaving.target && newSaving.current) {
      setSavings([
        ...savings,
        {
          id: Date.now().toString(),
          name: newSaving.name,
          target: parseFloat(newSaving.target),
          current: parseFloat(newSaving.current),
        },
      ]);
      setNewSaving({ name: '', target: '', current: '' });
    }
  };

  const renderSavingItem = ({ item }) => {
    const progress = (item.current / item.target) * 100;
    return (
      <View style={[styles.savingItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}>
        <Text style={[styles.savingName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
        <Text style={[styles.savingProgress, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
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
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Savings Tracker</Text>
      <FlatList
        data={savings}
        renderItem={renderSavingItem}
        keyExtractor={(item) => item.id}
        style={styles.savingsList}
      />
      <View style={styles.addSavingContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Saving Name"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={newSaving.name}
          onChangeText={(text) => setNewSaving({ ...newSaving, name: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Target Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newSaving.target}
          onChangeText={(text) => setNewSaving({ ...newSaving, target: text })}
        />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}
          placeholder="Current Amount"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          keyboardType="numeric"
          value={newSaving.current}
          onChangeText={(text) => setNewSaving({ ...newSaving, current: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSaving}>
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
  savingsList: {
    flex: 1,
  },
  savingItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  savingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingProgress: {
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
  addSavingContainer: {
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

export default SavingsTrackerScreen;

