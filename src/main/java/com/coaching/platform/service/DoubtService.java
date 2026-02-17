package com.coaching.platform.service;

import com.coaching.platform.entity.Doubt;
import com.coaching.platform.entity.User;
import com.coaching.platform.repository.DoubtRepository;
import com.coaching.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for AI-powered doubt solving
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DoubtService {

    private final DoubtRepository doubtRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    /**
     * Ask a doubt and get AI response
     */
    @Transactional
    public Doubt askDoubt(UUID studentId, String question, String context) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // Get AI response
        String aiResponse = aiService.askQuestion(question, context);

        // Save doubt
        Doubt doubt = Doubt.builder()
                .student(student)
                .question(question)
                .aiResponse(aiResponse)
                .context(context)
                .build();

        return doubtRepository.save(doubt);
    }

    /**
     * Get doubt history for student (chat history)
     */
    public List<Doubt> getDoubtHistory(UUID studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return doubtRepository.findTop20ByStudentOrderByAskedAtDesc(student);
    }

    /**
     * Delete a doubt from history
     */
    @Transactional
    public void deleteDoubt(UUID doubtId) {
        doubtRepository.deleteById(doubtId);
    }
}
