import { useState, useEffect } from 'react';
import { examService } from '../services/examService';
import type { BatchSummary, Exam, AnswerSheet } from '../types/exam';

export const useBatches = () => {
    const [batches, setBatches] = useState<BatchSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await examService.getMyBatches();
            setBatches(data);
            setError(null);
        } catch (err) {
            setError('Failed to load batches');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    return { batches, loading, error, refetch: fetchBatches };
};

export const useExams = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const data = await examService.getMyExams();
            setExams(data);
            setError(null);
        } catch (err) {
            setError('Failed to load exams');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    return { exams, loading, error, refetch: fetchExams };
};

export const useEvaluationQueue = () => {
    const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const data = await examService.getEvaluationQueue();
            setAnswerSheets(data);
            setError(null);
        } catch (err) {
            setError('Failed to load evaluation queue');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    return { answerSheets, loading, error, refetch: fetchQueue };
};
