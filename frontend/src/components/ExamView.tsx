import React, { useState, useEffect } from 'react';
import { Timer, ArrowLeft, ArrowRight, Upload, X, Save } from 'lucide-react';
import type { AnswerSheet } from '../types/exam';
import { studentExamService } from '../services/studentExamService';

interface ExamViewProps {
    answerSheet: AnswerSheet;
    onClose: () => void;
}

const ExamView: React.FC<ExamViewProps> = ({ answerSheet, onClose }) => {
    const { exam } = answerSheet;
    // Fallback if exam is missing in answerSheet (shouldn't happen with correct backend)
    if (!exam || !exam.questions) return <div>Error loading exam data</div>;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({}); // Map questionId -> answer
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize answers from answerSheet if resizing
    useEffect(() => {
        const initialAnswers: Record<string, any> = {};
        if (answerSheet.answers) {
            answerSheet.answers.forEach(ans => {
                if (ans.selectedOptionId) initialAnswers[ans.questionId] = ans.selectedOptionId;
                if (ans.answerText) initialAnswers[ans.questionId] = ans.answerText;
            });
        }
        setAnswers(initialAnswers);
    }, [answerSheet]);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Helper to find answer ID
    const getAnswerId = (questionId: string) => {
        return answerSheet.answers?.find(a => a.questionId === questionId)?.id;
    };

    const handleAnswerChange = async (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));

        const answerId = getAnswerId(questionId);
        if (answerId) {
            // Debounce this in production
            try {
                await studentExamService.saveAnswer(answerId, value);
            } catch (e) { }
        }
    };

    // Manual submit
    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await studentExamService.submitExam(answerSheet.id);
            onClose();
        } catch (error) {
            alert('Error submitting exam');
            setIsSubmitting(false);
        }
    };

    const currentQuestion = exam.questions[currentQuestionIndex];
    if (!currentQuestion) return <div>Question not found</div>;

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
            {/* Header */}
            <header className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                        {currentQuestionIndex + 1}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 truncate max-w-xs md:max-w-md">{exam.title}</h1>
                        <p className="text-xs text-gray-500">
                            Question {currentQuestionIndex + 1} of {exam.questions.length} • {currentQuestion.points} Points
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`
                        flex items-center px-4 py-2 rounded-lg font-mono font-medium shadow-sm border transition-colors
                        ${timeLeft < 300
                            ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                            : 'bg-white text-gray-700 border-gray-200'}
                    `}>
                        <Timer className={`w-5 h-5 mr-2 ${timeLeft < 300 ? 'text-red-500' : 'text-gray-400'}`} />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => onClose()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 min-h-[400px]">
                            <div className="mb-8">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4 border border-indigo-100">
                                    {currentQuestion.type === 'OBJECTIVE' ? 'Multiple Choice' : 'Subjective'}
                                </span>
                                <h2 className="text-xl md:text-2xl text-gray-900 leading-relaxed font-medium">
                                    {currentQuestion.questionText}
                                </h2>
                            </div>

                            {/* Answers */}
                            <div className="space-y-4">
                                {currentQuestion.type === 'OBJECTIVE' && currentQuestion.options ? (
                                    <div className="grid gap-3">
                                        {currentQuestion.options.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`
                                                    relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 group
                                                    ${answers[currentQuestion.id!] === option.id
                                                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                                                    ${answers[currentQuestion.id!] === option.id
                                                        ? 'border-indigo-600 bg-indigo-600'
                                                        : 'border-gray-300 group-hover:border-indigo-400'}
                                                `}>
                                                    {answers[currentQuestion.id!] === option.id && (
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    )}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={currentQuestion.id}
                                                    value={option.id}
                                                    checked={answers[currentQuestion.id!] === option.id}
                                                    onChange={() => handleAnswerChange(currentQuestion.id!, option.id!)}
                                                    className="hidden"
                                                />
                                                <span className={`text-base ${answers[currentQuestion.id!] === option.id ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                                                    {option.optionText}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-base leading-relaxed"
                                            placeholder="Type your detailed answer here..."
                                            value={answers[currentQuestion.id!] || ''}
                                            onChange={(e) => handleAnswerChange(currentQuestion.id!, e.target.value)}
                                        />

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-indigo-300 transition-colors cursor-pointer group">
                                            <div className="flex items-center text-gray-600 group-hover:text-indigo-600">
                                                <Upload className="w-5 h-5 mr-3" />
                                                <span className="text-sm">Upload handwritten answer (Optional)</span>
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                Choose File
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col hidden lg:flex shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Question Matrix</h3>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                                {Object.keys(answers).length}/{exam.questions.length} Answered
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {exam.questions.map((q, idx) => {
                                const isAnswered = !!answers[q.id!];
                                const isCurrent = idx === currentQuestionIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`
                                            h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                                            ${isCurrent
                                                ? 'bg-indigo-600 text-white shadow-md scale-110 ring-2 ring-indigo-200'
                                                : isAnswered
                                                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center text-xs text-gray-500">
                                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                                <span>Current</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200 mr-2"></div>
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <div className="w-3 h-3 rounded-full bg-gray-50 border border-gray-200 mr-2"></div>
                                <span>Not Answered</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Nav */}
            <footer className="h-20 bg-white border-t border-gray-200 px-6 flex items-center justify-between lg:hidden z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Prev
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-gray-900">
                        Question {currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                        of {exam.questions.length}
                    </span>
                </div>
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min((exam.questions?.length || 0) - 1, prev + 1))}
                    disabled={currentQuestionIndex === (exam.questions?.length || 0) - 1}
                    className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
                >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </footer>
        </div>
    );
};

export default ExamView;
