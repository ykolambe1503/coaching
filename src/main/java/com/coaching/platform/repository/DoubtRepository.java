package com.coaching.platform.repository;

import com.coaching.platform.entity.Doubt;
import com.coaching.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, UUID> {

    List<Doubt> findByStudentOrderByAskedAtDesc(User student);

    List<Doubt> findTop20ByStudentOrderByAskedAtDesc(User student);
}
