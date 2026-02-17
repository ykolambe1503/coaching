package com.coaching.platform.controller;

import com.coaching.platform.dto.*;
import com.coaching.platform.service.AnswerSheetService;
import com.coaching.platform.service.ExamService;
import com.coaching.platform.service.FacultyBatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for faculty operations
 */
@RestController
@RequestMapping("/api/v1/faculty")
@RequiredArgsConstructor
@Slf4j
public class FacultyController {

    private final ExamService examService;
    private final FacultyBatchService batchService;
    private final AnswerSheetService answerSheetService;

    private UUID getCurrentFacultyId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // This will be replaced with proper user service call
        return UUID.randomUUID(); // Placeholder
    }

    // Batch Management
    @GetMapping("/batches")
    public ResponseEntity<List<BatchSummary>> getMyBatches() {
        UUID facultyId = getCurrentFacultyId();
        log.info("GET /api/v1/faculty/batches for faculty: {}", facultyId);
        List<BatchSummary> batches = batchService.getFacultyBatches(facultyId);
        return ResponseEntity.ok(batches);
    }

    // Exam Management
    @GetMapping("/exams")
    public ResponseEntity<List<ExamResponse>> getMyExams() {
        UUID facultyId = getCurrentFacultyId();
        log.info("GET /api/v1/faculty/exams for faculty: {}", facultyId);
        List<ExamResponse> exams = examService.getFacultyExams(facultyId);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/exams")
    public ResponseEntity<ExamResponse> createExam(@Valid @RequestBody CreateExamRequest request) {
        UUID facultyId = getCurrentFacultyId();
        log.info("POST /api/v1/faculty/exams for faculty: {}", facultyId);
        ExamResponse exam = examService.createExam(request, facultyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(exam);
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<ExamResponse> getExam(@PathVariable UUID id) {
        UUID facultyId = getCurrentFacultyId();
        log.info("GET /api/v1/faculty/exams/{}", id);
        ExamResponse exam = examService.getExamById(id, facultyId);
        return ResponseEntity.ok(exam);
    }

    @PostMapping("/exams/{id}/publish")
    public ResponseEntity<Void> publishExam(@PathVariable UUID id) {
        UUID facultyId = getCurrentFacultyId();
        log.info("POST /api/v1/faculty/exams/{}/publish", id);
        examService.publishExam(id, facultyId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/exams/{id}/questions")
    public ResponseEntity<Void> addQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody QuestionRequest request) {
        UUID facultyId = getCurrentFacultyId();
        log.info("POST /api/v1/faculty/exams/{}/questions", id);
        examService.addQuestion(id, request, facultyId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID id) {
        UUID facultyId = getCurrentFacultyId();
        log.info("DELETE /api/v1/faculty/questions/{}", id);
        examService.deleteQuestion(id, facultyId);
        return ResponseEntity.noContent().build();
    }

    // Evaluation Queue
    @GetMapping("/evaluation-queue")
    public ResponseEntity<List<AnswerSheetSummary>> getEvaluationQueue() {
        UUID facultyId = getCurrentFacultyId();
        log.info("GET /api/v1/faculty/evaluation-queue for faculty: {}", facultyId);
        List<AnswerSheetSummary> queue = answerSheetService.getEvaluationQueue(facultyId);
        return ResponseEntity.ok(queue);
    }

    @PutMapping("/answers/{id}/grade")
    public ResponseEntity<Void> gradeAnswer(
            @PathVariable UUID id,
            @Valid @RequestBody GradeRequest request) {
        UUID facultyId = getCurrentFacultyId();
        log.info("PUT /api/v1/faculty/answers/{}/grade", id);
        answerSheetService.gradeAnswer(id, request, facultyId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/answer-sheets/{id}/submit-grading")
    public ResponseEntity<Void> submitGrading(@PathVariable UUID id) {
        UUID facultyId = getCurrentFacultyId();
        log.info("POST /api/v1/faculty/answer-sheets/{}/submit-grading", id);
        answerSheetService.submitGrading(id, facultyId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/answer-sheets/{id}/auto-grade")
    public ResponseEntity<Void> autoGrade(@PathVariable UUID id) {
        UUID facultyId = getCurrentFacultyId();
        log.info("POST /api/v1/faculty/answer-sheets/{}/auto-grade", id);
        answerSheetService.autoGradeObjectiveQuestions(id, facultyId);
        return ResponseEntity.ok().build();
    }
}
