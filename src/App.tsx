import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { questions } from './data/questions';
import { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    timeRemaining: 60,
    isGameStarted: false,
    isGameCompleted: false,
    unlockedSections: new Array(questions.length).fill(false),
  });

  const handleStart = () => {
    setGameState(prev => ({
      ...prev,
      isGameStarted: true,
    }));
  };

  const handleAnswer = (isCorrect: boolean, timeRemaining: number) => {
    if (isCorrect) {
      const newUnlockedSections = [...gameState.unlockedSections];
      newUnlockedSections[gameState.currentLevel] = true;

      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        currentLevel: prev.currentLevel + 1,
        unlockedSections: newUnlockedSections,
        isGameCompleted: prev.currentLevel + 1 === questions.length,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        isGameCompleted: prev.currentLevel + 1 === questions.length,
      }));
    }
  };

  const handleRestart = () => {
    setGameState({
      currentLevel: 0,
      score: 0,
      timeRemaining: 60,
      isGameStarted: true,
      isGameCompleted: false,
      unlockedSections: new Array(questions.length).fill(false),
    });
  };

  if (!gameState.isGameStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (gameState.isGameCompleted) {
    return (
      <CompletionScreen
        score={gameState.score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <QuizScreen
      question={questions[gameState.currentLevel]}
      onAnswer={handleAnswer}
      currentLevel={gameState.currentLevel}
      totalLevels={questions.length}
    />
  );
}

export default App;