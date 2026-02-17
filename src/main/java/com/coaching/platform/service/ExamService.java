package com.coaching.platform.service;

import com.coaching.platform.dto.*;
import com.coaching.platform.entity.*;
import com.coaching.platform.enums.ExamStatus;
import com.coaching.platform.enums.QuestionType;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.*;
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
public class ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional
    public ExamResponse createExam(CreateExamRequest request, UUID facultyId) {
        log.info("Creating exam: {} by faculty: {}", request.getTitle(), facultyId);

        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        Exam exam = Exam.builder()
                .title(request.getTitle())
                .instructions(request.getInstructions())
                .durationMinutes(request.getDurationMinutes())
                .createdBy(faculty)
                .organization(faculty.getOrganization())
                .batch(batch)
                .status(ExamStatus.DRAFT)
                .build();

        exam = examRepository.save(exam);
        log.info("Exam created with ID: {}", exam.getId());

        return convertToResponse(exam);
    }

    @Transactional
    public void addQuestion(UUID examId, QuestionRequest request, UUID facultyId) {
        log.info("Adding question to exam: {}", examId);

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        verifyFacultyOwnsExam(exam, facultyId);

        Question question = Question.builder()
                .exam(exam)
                .type(request.getType())
                .questionText(request.getQuestionText())
                .points(request.getPoints())
                .orderNumber(request.getOrderNumber())
                .build();

        // Add options for objective questions
        if (request.getType() == QuestionType.OBJECTIVE && request.getOptions() != null) {
            for (QuestionRequest.OptionRequest optReq : request.getOptions()) {
                Option option = Option.builder()
                        .optionText(optReq.getOptionText())
                        .isCorrect(optReq.getIsCorrect())
                        .orderNumber(optReq.getOrderNumber())
                        .build();
                question.addOption(option);
            }
        }

        questionRepository.save(question);
        log.info("Question added to exam: {}", examId);
    }

    @Transactional
    public void publishExam(UUID examId, UUID facultyId) {
        log.info("Publishing exam: {}", examId);

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        verifyFacultyOwnsExam(exam, facultyId);

        if (exam.getQuestions().isEmpty()) {
            throw new IllegalStateException("Cannot publish exam without questions");
        }

        exam.publish();
        examRepository.save(exam);
        log.info("Exam published: {}", examId);
    }

    public List<ExamResponse> getFacultyExams(UUID facultyId) {
        log.info("Fetching exams for faculty: {}", facultyId);
        List<Exam> exams = examRepository.findByCreatedBy_Id(facultyId);
        return exams.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public ExamResponse getExamById(UUID examId, UUID facultyId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        verifyFacultyOwnsExam(exam, facultyId);

        return convertToResponse(exam);
    }

    @Transactional
    public void deleteQuestion(UUID questionId, UUID facultyId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        verifyFacultyOwnsExam(question.getExam(), facultyId);

        questionRepository.delete(question);
        log.info("Question deleted: {}", questionId);
    }

    private void verifyFacultyOwnsExam(Exam exam, UUID facultyId) {
        if (!exam.getCreatedBy().getId().equals(facultyId)) {
            throw new UnauthorizedException("You do not have permission to modify this exam");
        }
    }

    private ExamResponse convertToResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .instructions(exam.getInstructions())
                .durationMinutes(exam.getDurationMinutes())
                .status(exam.getStatus())
                .batchName(exam.getBatch() != null ? exam.getBatch().getName() : null)
                .batchId(exam.getBatch() != null ? exam.getBatch().getId() : null)
                .questionCount(exam.getQuestions().size())
                .totalPoints(exam.getTotalPoints())
                .createdAt(exam.getCreatedAt())
                .publishedAt(exam.getPublishedAt())
                .build();
    }
}
