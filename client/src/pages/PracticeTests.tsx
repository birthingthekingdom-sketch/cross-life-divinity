import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface PracticeTest {
  id: number;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number;
  courseId: number;
}

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export default function PracticeTests() {
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PracticeTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [, setLocation] = useLocation();

  // Fetch available practice tests
  useEffect(() => {
    const fetchPracticeTests = async () => {
      try {
        const response = await fetch('/api/practice-tests');
        const data = await response.json();
        setPracticeTests(data);
      } catch (error) {
        console.error('Error fetching practice tests:', error);
      }
    };

    fetchPracticeTests();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!testStarted || testCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeRemaining]);

  const handleStartTest = async (test: PracticeTest) => {
    setSelectedTest(test);
    setTestStarted(true);
    setTimeRemaining(test.timeLimit * 60); // Convert minutes to seconds

    try {
      const response = await fetch(`/api/practice-tests/${test.id}/questions`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentQuestionIndex].id]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    const result: TestResult = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage: Math.round(percentage),
      completedAt: new Date().toISOString()
    };

    setTestResult(result);
    setTestCompleted(true);

    // Save result to database
    try {
      await fetch('/api/practice-tests/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceTestId: selectedTest?.id,
          score: correctCount,
          totalQuestions: questions.length,
          percentage: percentage
        })
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Practice Tests</h1>
          <p className="text-slate-600 mb-8">Take full-length practice tests to assess your readiness for the GED exam.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceTests.map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{test.title}</h3>
                <p className="text-slate-600 mb-4">{test.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-500">{test.totalQuestions} questions</span>
                  <span className="text-sm text-slate-500">{test.timeLimit} minutes</span>
                </div>
                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted && testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Test Completed!</h1>
            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-2">{testResult.percentage}%</div>
              <p className="text-2xl text-slate-600">
                You scored <span className="font-semibold">{testResult.score}</span> out of <span className="font-semibold">{testResult.totalQuestions}</span> questions
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Answer Review</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const isCorrect = userAnswers[question.id] === question.correctAnswer;
                  return (
                    <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className="font-semibold text-slate-900 mb-2">Question {index + 1}: {question.questionText}</p>
                      <p className="text-sm text-slate-600 mb-2">
                        Your answer: <span className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{userAnswers[question.id] || 'Not answered'}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-slate-600 mb-2">
                          Correct answer: <span className="text-green-600 font-semibold">{question.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-sm text-slate-600">{question.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setTestStarted(false);
                setTestCompleted(false);
                setSelectedTest(null);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setTestResult(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Back to Practice Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestion.id] !== undefined;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{selectedTest?.title}</h2>
              <p className="text-sm text-slate-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">{currentQuestion.questionText}</h3>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors" style={{
                  borderColor: userAnswers[currentQuestion.id] === option ? '#2563eb' : '#e2e8f0'
                }}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={userAnswers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(option)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : userAnswers[questions[index].id]
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-200 text-slate-900'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                disabled={!isAnswered}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}
