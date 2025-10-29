import React, { useState } from "react";
import { Upload, FileText, Brain, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/cards";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "../integrations/Core";
import { Quiz } from "../entities/Quiz";
import { Skeleton } from "../components/ui/skeleton";

export default function TestingHub() {
  const [inputText, setInputText] = useState("");
  const [inputMethod, setInputMethod] = useState("text");
  const [quizType, setQuizType] = useState("multiple_choice");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { file_url } = await UploadFile({ file });
    const extractResult = await ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: "object",
        properties: {
          content: { type: "string" }
        }
      }
    });

    if (extractResult.status === "success") {
      setInputText(extractResult.output.content || "");
    }
  };

  const generateQuiz = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    try {
      const prompt = `Generate a ${difficulty} ${quizType.replace('_', ' ')} based on the following content. Create 5-10 questions with clear options and explanations.

Content: ${inputText}

Please format as JSON with this structure:
{
  "title": "Generated Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Why this is correct"
    }
  ]
}`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "string" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      const quiz = await Quiz.create({
        title: response.title,
        quiz_type: quizType,
        questions: response.questions,
        difficulty
      });

      setCurrentQuiz(quiz);
      setUserAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
    setIsGenerating(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    let correct = 0;
    currentQuiz.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / currentQuiz.questions.length) * 100);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Testing Hub</h1>
          <p className="text-slate-600">Generate custom quizzes and exams from your study materials.</p>
        </div>

        {!currentQuiz ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Input Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Input Method</Label>
                  <Select value={inputMethod} onValueChange={setInputMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Direct Text Input</SelectItem>
                      <SelectItem value="file">Upload File (PDF/Text)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputMethod === "text" ? (
                  <Textarea
                    placeholder="Paste your study material, exam content, or any text you want to generate questions from..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] w-full text-base p-3 resize-y"
                  />

                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Upload PDF or text file</p>
                    <label htmlFor="quiz-file-upload">
                      <Button as="div" variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                    <input
                      id="quiz-file-upload"
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {inputText && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600">
                      Content length: <span className="font-medium">{inputText.length} characters</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation Settings */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Quiz Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Quiz Type</Label>
                  <Select value={quizType} onValueChange={setQuizType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice Quiz</SelectItem>
                      <SelectItem value="mock_exam">Mock Exam</SelectItem>
                      <SelectItem value="exercise">Practice Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">AI Generation Features</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Smart question extraction</li>
                    <li>• Multiple choice options</li>
                    <li>• Detailed explanations</li>
                    <li>• Adaptive difficulty</li>
                  </ul>
                </div>

                <Button
                  onClick={generateQuiz}
                  disabled={!inputText.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <Skeleton className="w-4 h-4 mr-2" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Quiz Display */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentQuiz.title}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{currentQuiz.quiz_type.replace('_', ' ')}</Badge>
                  <Badge variant="outline">{currentQuiz.difficulty}</Badge>
                  <Badge variant="outline">{currentQuiz.questions.length} questions</Badge>
                </div>
              </div>
              {showResults && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{calculateScore()}%</div>
                  <div className="text-sm text-slate-600">Final Score</div>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              {currentQuiz.questions.map((question, index) => (
                <Card key={index} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">{question.question}</h3>
                        <RadioGroup
                          value={userAnswers[index]}
                          onValueChange={(value) => handleAnswerChange(index, value)}
                          disabled={showResults}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`q${index}-${optionIndex}`} />
                              <Label
                                htmlFor={`q${index}-${optionIndex}`}
                                className={`flex-1 cursor-pointer p-2 rounded ${
                                  showResults
                                    ? option === question.correct_answer
                                      ? "bg-green-50 text-green-800 border border-green-200"
                                      : userAnswers[index] === option && option !== question.correct_answer
                                      ? "bg-red-50 text-red-800 border border-red-200"
                                      : ""
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                {option}
                                {showResults && option === question.correct_answer && (
                                  <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />
                                )}
                                {showResults && userAnswers[index] === option && option !== question.correct_answer && (
                                  <AlertCircle className="inline w-4 h-4 ml-2 text-red-600" />
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {showResults && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-semibold text-slate-800 mb-2">Explanation:</h4>
                            <p className="text-slate-700">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuiz(null)}
              >
                Create New Quiz
              </Button>
              {!showResults ? (
                <Button
                  onClick={submitQuiz}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentQuiz(null);
                    setUserAnswers({});
                    setShowResults(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Take Another Quiz
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}