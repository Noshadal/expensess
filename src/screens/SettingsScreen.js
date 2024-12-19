import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const toggleSwitch = (setter) => (value) => setter(value);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Settings</Text>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name={isDarkMode ? 'nightlight-round' : 'wb-sunny'} size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.settingText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Dark Mode</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="notifications" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.settingText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Notifications</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch(setNotificationsEnabled)}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="fingerprint" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.settingText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Biometric Login</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={biometricsEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch(setBiometricsEnabled)}
          value={biometricsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="save" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.settingText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Auto-save</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={autoSaveEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch(setAutoSaveEnabled)}
          value={autoSaveEnabled}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Terms of Service</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>Version 1.0.0</Text>
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
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default SettingsScreen;