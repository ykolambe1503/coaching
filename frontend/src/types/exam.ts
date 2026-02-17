export type QuestionType = 'OBJECTIVE' | 'DESCRIPTIVE';

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type SubmissionStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';

export interface Option {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    orderNumber: number;
}

export interface Question {
    id?: string;
    type: QuestionType;
    questionText: string;
    points: number;
    orderNumber: number;
    options?: Option[];
}

export interface Exam {
    id: string;
    title: string;
    description?: string; // Added description
    instructions?: string;
    durationMinutes: number;
    status: ExamStatus;
    batchName?: string;
    batchId: string;
    questionCount: number;
    totalPoints: number;
    createdAt: string;
    startTime?: string; // Added startTime
    publishedAt?: string;
    questions?: Question[];
}

export interface AnswerSheet {
    id: string;
    exam: Exam; // Changed from flatten fields to object
    studentName: string;
    studentEmail: string;
    studentId: string;
    submittedAt: string;
    status: SubmissionStatus;
    totalPoints?: number;
    obtainedPoints?: number;
    answers?: Answer[];
}

export interface Answer {
    id: string;
    questionId: string;
    questionText: string;
    questionType: QuestionType;
    questionPoints: number;
    answerText?: string;
    selectedOptionId?: string;
    pointsAwarded?: number;
    feedback?: string;
    isAutoGraded: boolean;
}

export interface BatchSummary {
    id: string;
    name: string;
    studentCount: number;
    examCount: number;
}

// Request DTOs
export interface CreateExamRequest {
    title: string;
    instructions?: string;
    durationMinutes: number;
    batchId: string;
}

export interface QuestionRequest {
    type: QuestionType;
    questionText: string;
    points: number;
    orderNumber: number;
    options?: {
        optionText: string;
        isCorrect: boolean;
        orderNumber: number;
    }[];
}

export interface GradeRequest {
    pointsAwarded: number;
    feedback?: string;
}
