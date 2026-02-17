package com.coaching.platform.service;

import com.coaching.platform.entity.*;
import com.coaching.platform.enums.ExamStatus;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for student exam participation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StudentExamService {

        private final ExamRepository examRepository;
        private final AnswerSheetRepository answerSheetRepository;
        private final BatchRepository batchRepository;
        private final UserRepository userRepository;

        /**
         * Get available published exams for a student's batches
         */
        public List<Exam> getAvailableExams(UUID studentId) {
                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

                // Get student's batches
                List<Batch> studentBatches = batchRepository.findByStudentsContaining(student);

                // Get published exams for these batches
                return studentBatches.stream()
                                .flatMap(batch -> examRepository.findByBatchAndStatus(batch, ExamStatus.PUBLISHED)
                                                .stream())
                                .distinct()
                                .collect(Collectors.toList());
        }

        /**
         * Get exam details for student (instructions, questions)
         */
        public Exam getExamDetails(UUID examId) {
                return examRepository.findById(examId)
                                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));
        }

        /**
         * Start an exam - create answer sheet with timer
         */
        @Transactional
        public AnswerSheet startExam(UUID examId, UUID studentId) {
                Exam exam = examRepository.findById(examId)
                                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

                // Check if student already started this exam
                List<AnswerSheet> existingSheets = answerSheetRepository.findByExamAndStudent(exam, student);
                if (!existingSheets.isEmpty()) {
                        return existingSheets.get(0); // Return existing answer sheet
                }

                // Create new answer sheet
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime expiresAt = now.plusMinutes(exam.getDurationMinutes());

                AnswerSheet answerSheet = AnswerSheet.builder()
                                .exam(exam)
                                .student(student)
                                .startedAt(now)
                                .expiresAt(expiresAt)
                                .totalPoints(exam.getTotalPoints())
                                .build();

                // Pre-create answers for all questions
                List<Answer> answers = exam.getQuestions().stream()
                                .map(question -> Answer.builder()
                                                .answerSheet(answerSheet)
                                                .question(question)
                                                .answeredAt(null)
                                                .build())
                                .collect(Collectors.toList());

                answerSheet.setAnswers(answers);

                return answerSheetRepository.save(answerSheet);
        }

        /**
         * Get in-progress exam for a student
         */
        public AnswerSheet getActiveExam(UUID studentId) {
                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

                return answerSheetRepository
                                .findByStudentAndStatus(student,
                                                com.coaching.platform.enums.SubmissionStatus.IN_PROGRESS)
                                .stream()
                                .findFirst()
                                .orElse(null);
        }
}
