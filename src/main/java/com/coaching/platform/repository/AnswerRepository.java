package com.coaching.platform.repository;

import com.coaching.platform.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, UUID> {

    List<Answer> findByAnswerSheet_Id(UUID answerSheetId);

    List<Answer> findByQuestion_Id(UUID questionId);
}
