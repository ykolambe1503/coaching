package com.coaching.platform.enums;

/**
 * Status of an answer sheet submission
 */
public enum SubmissionStatus {
    /**
     * Student is still working on the exam
     */
    IN_PROGRESS,

    /**
     * Student has submitted the exam
     */
    SUBMITTED,

    /**
     * Faculty has completed grading
     */
    GRADED
}
