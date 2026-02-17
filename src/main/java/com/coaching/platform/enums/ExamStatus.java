package com.coaching.platform.enums;

/**
 * Status of an exam
 */
public enum ExamStatus {
    /**
     * Exam is being created, not visible to students
     */
    DRAFT,

    /**
     * Exam is published and available to students
     */
    PUBLISHED,

    /**
     * Exam is closed, no more submissions allowed
     */
    CLOSED
}
