package com.coaching.platform.controller;

import com.coaching.platform.dto.*;
import com.coaching.platform.entity.*;
import com.coaching.platform.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for student operations
 */
@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Slf4j
public class StudentController {

    private final StudentExamService studentExamService;
    private final AnswerSubmissionService answerSubmissionService;
    private final PerformanceService performanceService;
    private final DoubtService doubtService;

    // ========== Exam Endpoints ==========

    /**
     * Get available published exams for student
     */
    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAvailableExams(@AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        List<Exam> exams = studentExamService.getAvailableExams(studentId);
        return ResponseEntity.ok(exams);
    }

    /**
     * Get exam details and instructions
     */
    @GetMapping("/exams/{examId}")
    public ResponseEntity<Exam> getExamDetails(@PathVariable UUID examId) {
        Exam exam = studentExamService.getExamDetails(examId);
        return ResponseEntity.ok(exam);
    }

    /**
     * Start an exam (create answer sheet with timer)
     */
    @PostMapping("/exams/{examId}/start")
    public ResponseEntity<AnswerSheet> startExam(
            @PathVariable UUID examId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        AnswerSheet answerSheet = studentExamService.startExam(examId, studentId);
        return ResponseEntity.ok(answerSheet);
    }

    /**
     * Get active in-progress exam
     */
    @GetMapping("/exams/active")
    public ResponseEntity<AnswerSheet> getActiveExam(@AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        AnswerSheet activeExam = studentExamService.getActiveExam(studentId);
        return activeExam != null ? ResponseEntity.ok(activeExam) : ResponseEntity.noContent().build();
    }

    // ========== Answer Submission Endpoints ==========

    /**
     * Save answer text
     */
    @PutMapping("/answers/{answerId}")
    public ResponseEntity<Answer> saveAnswer(
            @PathVariable UUID answerId,
            @RequestBody String answerText) {
        Answer answer = answerSubmissionService.saveAnswer(answerId, answerText);
        return ResponseEntity.ok(answer);
    }

    /**
     * Upload handwritten answer image
     */
    @PostMapping("/answers/{answerId}/upload-image")
    public ResponseEntity<Answer> uploadAnswerImage(
            @PathVariable UUID answerId,
            @RequestParam("image") MultipartFile image) throws IOException {
        Answer answer = answerSubmissionService.uploadAnswerImage(answerId, image);
        return ResponseEntity.ok(answer);
    }

    /**
     * Submit complete answer sheet
     */
    @PostMapping("/answer-sheets/{answerSheetId}/submit")
    public ResponseEntity<AnswerSheet> submitAnswerSheet(@PathVariable UUID answerSheetId) {
        AnswerSheet answerSheet = answerSubmissionService.submitAnswerSheet(answerSheetId);
        return ResponseEntity.ok(answerSheet);
    }

    // ========== Performance Analytics Endpoints ==========

    /**
     * Get student performance data
     */
    @GetMapping("/performance")
    public ResponseEntity<PerformanceData> getPerformance(@AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        PerformanceData performance = performanceService.getStudentPerformance(studentId);
        return ResponseEntity.ok(performance);
    }

    /**
     * Get performance comparison (student vs batch average)
     */
    @GetMapping("/performance/comparison")
    public ResponseEntity<PerformanceComparison> getPerformanceComparison(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        PerformanceComparison comparison = performanceService.getComparisonData(studentId);
        return ResponseEntity.ok(comparison);
    }

    // ========== AI Doubt Solver Endpoints ==========

    /**
     * Ask AI doubt
     */
    @PostMapping("/doubts")
    public ResponseEntity<DoubtResponse> askDoubt(
            @RequestBody DoubtRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        Doubt doubt = doubtService.askDoubt(studentId, request.getQuestion(), request.getContext());

        DoubtResponse response = DoubtResponse.builder()
                .id(doubt.getId())
                .question(doubt.getQuestion())
                .aiResponse(doubt.getAiResponse())
                .context(doubt.getContext())
                .askedAt(doubt.getAskedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Get doubt history (chat history)
     */
    @GetMapping("/doubts")
    public ResponseEntity<List<DoubtResponse>> getDoubtHistory(@AuthenticationPrincipal UserDetails userDetails) {
        UUID studentId = getCurrentStudentId(userDetails);
        List<Doubt> doubts = doubtService.getDoubtHistory(studentId);

        List<DoubtResponse> responses = doubts.stream()
                .map(d -> DoubtResponse.builder()
                        .id(d.getId())
                        .question(d.getQuestion())
                        .aiResponse(d.getAiResponse())
                        .context(d.getContext())
                        .askedAt(d.getAskedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Delete doubt from history
     */
    @DeleteMapping("/doubts/{doubtId}")
    public ResponseEntity<Void> deleteDoubt(@PathVariable UUID doubtId) {
        doubtService.deleteDoubt(doubtId);
        return ResponseEntity.noContent().build();
    }

    // ========== Helper Methods ==========

    /**
     * Extract current student ID from authenticated user
     * TODO: Implement proper user retrieval from security context
     */
    private UUID getCurrentStudentId(UserDetails userDetails) {
        // Placeholder - in production, fetch from UserRepository
        String username = userDetails.getUsername();
        // For now, return a placeholder UUID
        // In production: userRepository.findByUsername(username).getId()
        return UUID.randomUUID(); // FIXM: Implement proper user ID retrieval
    }
}
