package com.coaching.platform.repository;

import com.coaching.platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    List<Question> findByExam_IdOrderByOrderNumberAsc(UUID examId);

    void deleteByExam_Id(UUID examId);
}
