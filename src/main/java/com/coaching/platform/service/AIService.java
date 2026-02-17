package com.coaching.platform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for AI interactions (placeholder for OpenAI/Gemini integration)
 * TODO: Integrate with actual AI provider
 */
@Service
@Slf4j
public class AIService {

    @Value("${ai.provider:mock}")
    private String aiProvider;

    /**
     * Ask question to AI and get response
     * TODO: Implement OpenAI/Gemini API call
     */
    public String askQuestion(String question, String context) {
        log.info("AI Question: {} with context: {}", question, context);

        // Mock response for now
        // In production, integrate with:
        // - OpenAI GPT-4 API
        // - Google Gemini API
        // - Self-hosted LLM

        return "This is a placeholder AI response. " +
                "To enable AI doubt solving, integrate with OpenAI or Gemini API. " +
                "Your question was: " + question;
    }

    /**
     * Format AI response (parse markdown, etc.)
     */
    public String formatResponse(String rawResponse) {
        // Add markdown formatting, code block highlighting, etc.
        return rawResponse;
    }
}
