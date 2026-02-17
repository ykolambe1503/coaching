package com.coaching.platform.service;

import com.coaching.platform.entity.Answer;
import com.coaching.platform.entity.AnswerSheet;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.repository.AnswerRepository;
import com.coaching.platform.repository.AnswerSheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for student answer submission
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnswerSubmissionService {

    private final AnswerSheetRepository answerSheetRepository;
    private final AnswerRepository answerRepository;
    private final FileStorageService fileStorageService;

    /**
     * Save answer text
     */
    @Transactional
    public Answer saveAnswer(UUID answerId, String answerText) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        answer.setAnswerText(answerText);
        answer.setAnsweredAt(LocalDateTime.now());

        return answerRepository.save(answer);
    }

    /**
     * Upload and attach image to answer
     */
    @Transactional
    public Answer uploadAnswerImage(UUID answerId, MultipartFile image) throws IOException {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer", "id", answerId));

        // Upload image and get URL
        String imageUrl = fileStorageService.uploadImage(image, answerId);

        // Add to answer's image URLs
        if (answer.getImageUrls() == null) {
            answer.setImageUrls(new ArrayList<>());
        }
        answer.getImageUrls().add(imageUrl);
        answer.setAnsweredAt(LocalDateTime.now());

        return answerRepository.save(answer);
    }

    /**
     * Submit answer sheet
     */
    @Transactional
    public AnswerSheet submitAnswerSheet(UUID answerSheetId) {
        AnswerSheet answerSheet = answerSheetRepository.findById(answerSheetId)
                .orElseThrow(() -> new ResourceNotFoundException("AnswerSheet", "id", answerSheetId));

        answerSheet.submit();

        // Auto-grade objective questions
        answerSheet.getAnswers().forEach(answer -> {
            if (answer.getQuestion().getType() == com.coaching.platform.enums.QuestionType.OBJECTIVE) {
                answer.autoGrade();
            }
        });

        answerSheet.calculateObtainedPoints();

        return answerSheetRepository.save(answerSheet);
    }

    /**
     * Auto-submit exam when timer expires
     */
    @Transactional
    public void autoSubmitExpiredExams() {
        LocalDateTime now = LocalDateTime.now();
        List<AnswerSheet> expiredSheets = answerSheetRepository.findByStatusAndExpiresAtBefore(
                com.coaching.platform.enums.SubmissionStatus.IN_PROGRESS,
                now);

        for (AnswerSheet sheet : expiredSheets) {
            sheet.submit();
            sheet.getAnswers().forEach(answer -> {
                if (answer.getQuestion().getType() == com.coaching.platform.enums.QuestionType.OBJECTIVE) {
                    answer.autoGrade();
                }
            });
            sheet.calculateObtainedPoints();
            answerSheetRepository.save(sheet);
            log.info("Auto-submitted expired answer sheet: {}", sheet.getId());
        }
    }
}
