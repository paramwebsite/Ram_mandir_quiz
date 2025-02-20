import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, HelpCircle } from "lucide-react";
import useSound from "use-sound";
const ws: WebSocket = new WebSocket('wss://sustaining-emphasized-hippopotamus.glitch.me');
interface QuizScreenProps {
  question: {
    text: string;
    options: string[];
    correctAnswer: number;
    hint?: string;
  };
  onAnswer: (isCorrect: boolean, timeRemaining: number) => void;
  currentLevel: number;
  totalLevels: number;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  onAnswer,
  currentLevel,
  totalLevels,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerProcessing, setIsAnswerProcessing] = useState(false);
  const [playCorrect] = useSound("/sounds/correct.mp3", { volume: 0.5 });
  const [playIncorrect] = useSound("/sounds/incorrect.mp3", { volume: 0.5 });
 

  // Reset state when question changes
  useEffect(() => {
    setTimeRemaining(60);
    setShowHint(false);
    setSelectedAnswer(null);
    setIsAnswerProcessing(false);
  }, [question]);

  useEffect(() => {
    if (timeRemaining <= 0 && !isAnswerProcessing) {
      setIsAnswerProcessing(true);
      onAnswer(false, 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onAnswer, isAnswerProcessing]);

  const handleAnswer = async (index: number) => {
    if (isAnswerProcessing) return;

    setSelectedAnswer(index);
    setIsAnswerProcessing(true);

    const isCorrect = index === question.correctAnswer;

    if (isCorrect) {
      playCorrect();
      // Send WebSocket message to TouchDesigner with the current level
      ws.send(JSON.stringify({ action: "displayImage", level: currentLevel }));
    } else {
      playIncorrect();
    }

    // Wait for the sound to play
    await new Promise((resolve) => setTimeout(resolve, 500));
     
    // onAnswer(isCorrect, timeRemaining);
    if (!isCorrect) {
      onAnswer(false, timeRemaining);
    }
  };

  useEffect(() => {
    const handleMessage = (message: MessageEvent) => {
      if (message && message.data) {
        // Handle ping/pong for keepalive if needed
        if (message.data === "ping") {
          ws.send("pong");
          return;
        }
        
        // Parse the incoming message from TouchDesigner
        let data = JSON.parse(message.data);
        if (data.action === 'imageDisplayed') {
          console.log(`Image for level ${data.level} displayed.`);
          // Proceed to the next question after a short delay
          setTimeout(() => {
            onAnswer(true, timeRemaining);
          }, 1000);
        }
      }
    };
  
    ws.addEventListener('message', handleMessage);
  
    // Clean up the event listener on unmount
    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [onAnswer, timeRemaining]);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-semibold">
            Level {currentLevel + 1}/{totalLevels}
          </div>
          <div className="flex items-center gap-2 text-xl">
            <Timer className="text-orange-500" />
            <span
              className={timeRemaining < 10 ? "text-red-500" : "text-white"}
            >
              {timeRemaining}s
            </span>
          </div>
        </div>

        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          key={currentLevel}
        >
          <h2 className="text-2xl font-bold mb-6">{question.text}</h2>

          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-lg text-left text-lg transition-all ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                disabled={selectedAnswer !== null || isAnswerProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {question.hint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 mx-auto text-orange-400 hover:text-orange-300"
            >
              <HelpCircle size={20} />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-gray-400"
              >
                {question.hint}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
