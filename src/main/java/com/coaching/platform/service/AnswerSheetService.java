package com.coaching.platform.service;

import com.coaching.platform.dto.AnswerSheetSummary;
import com.coaching.platform.dto.GradeRequest;
import com.coaching.platform.entity.Answer;
import com.coaching.platform.entity.AnswerSheet;
import com.coaching.platform.enums.SubmissionStatus;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.AnswerRepository;
import com.coaching.platform.repository.AnswerSheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerSheetService {

    private final AnswerSheetRepository answerSheetRepository;
    private final AnswerRepository answerRepository;

    public List<AnswerSheetSummary> getEvaluationQueue(UUID facultyId) {
        log.info("Fetching evaluation queue for faculty: {}", facultyId);

        List<AnswerSheet> sheets = answerSheetRepository.findByFacultyAndStatus(
                facultyId, SubmissionStatus.SUBMITTED);

        return sheets.stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    public AnswerSheet getAnswerSheetDetails(UUID answerSheetId, UUID facultyId) {
        AnswerSheet sheet = answerSheetRepository.findById(answerSheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer sheet not found"));

        verifyFacultyOwnsAnswerSheet(sheet, facultyId);

        return sheet;
    }

    @Transactional
    public void gradeAnswer(UUID answerId, GradeRequest request, UUID facultyId) {
        log.info("Grading answer: {}", answerId);

        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        verifyFacultyOwnsAnswerSheet(answer.getAnswerSheet(), facultyId);

        answer.grade(request.getPointsAwarded(), request.getFeedback());
        answerRepository.save(answer);
        log.info("Answer graded: {}", answerId);
    }

    @Transactional
    public void submitGrading(UUID answerSheetId, UUID facultyId) {
        log.info("Submitting grading for answer sheet: {}", answerSheetId);

        AnswerSheet sheet = answerSheetRepository.findById(answerSheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer sheet not found"));

        verifyFacultyOwnsAnswerSheet(sheet, facultyId);

        if (!sheet.isFullyGraded()) {
            throw new IllegalStateException("All answers must be graded before submission");
        }

        sheet.calculateObtainedPoints();
        sheet.markAsGraded();
        answerSheetRepository.save(sheet);
        log.info("Grading submitted for answer sheet: {}", answerSheetId);
    }

    @Transactional
    public void autoGradeObjectiveQuestions(UUID answerSheetId, UUID facultyId) {
        log.info("Auto-grading objective questions for answer sheet: {}", answerSheetId);

        AnswerSheet sheet = answerSheetRepository.findById(answerSheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer sheet not found"));

        verifyFacultyOwnsAnswerSheet(sheet, facultyId);

        sheet.getAnswers().stream()
                .filter(answer -> answer.getQuestion().getType() == com.coaching.platform.enums.QuestionType.OBJECTIVE)
                .filter(answer -> !answer.getIsAutoGraded())
                .forEach(Answer::autoGrade);

        answerSheetRepository.save(sheet);
        log.info("Auto-grading completed for answer sheet: {}", answerSheetId);
    }

    private void verifyFacultyOwnsAnswerSheet(AnswerSheet sheet, UUID facultyId) {
        if (!sheet.getExam().getCreatedBy().getId().equals(facultyId)) {
            throw new UnauthorizedException("You do not have permission to grade this answer sheet");
        }
    }

    private AnswerSheetSummary convertToSummary(AnswerSheet sheet) {
        return AnswerSheetSummary.builder()
                .id(sheet.getId())
                .examTitle(sheet.getExam().getTitle())
                .examId(sheet.getExam().getId())
                .studentName(sheet.getStudent().getFirstName() + " " + sheet.getStudent().getLastName())
                .studentEmail(sheet.getStudent().getEmail())
                .studentId(sheet.getStudent().getId())
                .submittedAt(sheet.getSubmittedAt())
                .status(sheet.getStatus())
                .totalPoints(sheet.getTotalPoints())
                .obtainedPoints(sheet.getObtainedPoints())
                .build();
    }
}
