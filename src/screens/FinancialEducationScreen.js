import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const financialTopics = [
  {
    id: '1',
    title: 'Budgeting Basics',
    content: 'Learn how to create and stick to a budget. Budgeting is the foundation of financial health and helps you track your income and expenses.',
    quiz: [
      {
        question: 'What is the primary purpose of a budget?',
        options: ['To restrict spending', 'To track income and expenses', 'To increase debt', 'To avoid saving'],
        correctAnswer: 1,
      },
      {
        question: 'Which of the following is NOT typically included in a budget?',
        options: ['Rent/Mortgage', 'Groceries', 'Stock market predictions', 'Utilities'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: '2',
    title: 'Understanding Credit Scores',
    content: 'Discover what makes up your credit score, how to improve it, and why it\'s important for your financial future.',
    quiz: [
      {
        question: 'What is a good credit score range?',
        options: ['300-500', '500-600', '600-700', '700-850'],
        correctAnswer: 3,
      },
      {
        question: 'Which factor has the biggest impact on your credit score?',
        options: ['Credit utilization', 'Length of credit history', 'Types of credit', 'Recent credit inquiries'],
        correctAnswer: 0,
      },
    ],
  },
  // Add more topics with quizzes...
];

const FinancialEducationScreen = () => {
  const { isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizState, setQuizState] = useState({
    mode: false,
    currentQuestionIndex: 0,
    score: 0,
    completed: false,
  });
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('financialEducationProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (topicId, completed, quizScore) => {
    try {
      const updatedProgress = {
        ...progress,
        [topicId]: { completed, quizScore },
      };
      await AsyncStorage.setItem('financialEducationProgress', JSON.stringify(updatedProgress));
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const renderTopicItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.topicItem, { backgroundColor: isDarkMode ? '#333333' : '#F0F0F0' }]}
      onPress={() => {
        setSelectedTopic(item);
        setModalVisible(true);
        setQuizState({
          mode: false,
          currentQuestionIndex: 0,
          score: 0,
          completed: false,
        });
      }}
    >
      <View style={styles.topicContent}>
        <Text style={[styles.topicTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.title}</Text>
        {progress[item.id] && progress[item.id].completed && (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        )}
      </View>
      <Icon name="chevron-right" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
    </TouchableOpacity>
  );

  const handleAnswer = (selectedIndex) => {
    const currentQuestion = selectedTopic.quiz[quizState.currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;

    setQuizState(prevState => ({
      ...prevState,
      score: isCorrect ? prevState.score + 1 : prevState.score,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      completed: prevState.currentQuestionIndex + 1 >= selectedTopic.quiz.length,
    }));

    if (quizState.currentQuestionIndex + 1 >= selectedTopic.quiz.length) {
      const quizScore = ((quizState.score + (isCorrect ? 1 : 0)) / selectedTopic.quiz.length) * 100;
      saveProgress(selectedTopic.id, true, quizScore);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Financial Education</Text>
      <FlatList
        data={financialTopics}
        renderItem={renderTopicItem}
        keyExtractor={(item) => item.id}
        style={styles.topicList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' }]}>
            <ScrollView>
              {!quizState.mode ? (
                <>
                  <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    {selectedTopic?.title}
                  </Text>
                  <Text style={[styles.modalText, { color: isDarkMode ? '#DDDDDD' : '#333333' }]}>
                    {selectedTopic?.content}
                  </Text>
                  <TouchableOpacity
                    style={[styles.quizButton, { backgroundColor: isDarkMode ? '#4CAF50' : '#2196F3' }]}
                    onPress={() => setQuizState(prevState => ({ ...prevState, mode: true }))}
                  >
                    <Text style={styles.quizButtonText}>Take Quiz</Text>
                  </TouchableOpacity>
                </>
              ) : quizState.completed ? (
                <View style={styles.quizCompletedContainer}>
                  <Text style={[styles.quizCompletedText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    Quiz Completed!
                  </Text>
                  <Text style={[styles.scoreText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    Your Score: {quizState.score}/{selectedTopic?.quiz.length}
                  </Text>
                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: isDarkMode ? '#4CAF50' : '#2196F3' }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.quizContainer}>
                  <Text style={[styles.questionText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                    {selectedTopic?.quiz[quizState.currentQuestionIndex].question}
                  </Text>
                  {selectedTopic?.quiz[quizState.currentQuestionIndex].options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.answerButton, { backgroundColor: isDarkMode ? '#4CAF50' : '#2196F3' }]}
                      onPress={() => handleAnswer(index)}
                    >
                      <Text style={styles.answerButtonText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
            {!quizState.mode && (
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: isDarkMode ? '#4CAF50' : '#2196F3' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  topicList: {
    flex: 1,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizContainer: {
    marginTop: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  answerButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  quizCompletedContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  quizCompletedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default FinancialEducationScreen;

