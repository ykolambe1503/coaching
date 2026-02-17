package com.coaching.platform.repository;

import com.coaching.platform.entity.Batch;
import com.coaching.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BatchRepository extends JpaRepository<Batch, UUID> {

    List<Batch> findByCreatedBy(User creator);

    List<Batch> findByStudentsContaining(User student);

    List<Batch> findByFacultyContaining(User faculty);

    List<Batch> findByOrganization_OrgId(UUID orgId);
}
