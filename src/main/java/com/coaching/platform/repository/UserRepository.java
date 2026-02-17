package com.coaching.platform.repository;

import com.coaching.platform.entity.User;
import com.coaching.platform.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByOrganization_OrgIdAndRole(UUID orgId, Role role);

    List<User> findByOrganization_OrgId(UUID orgId);
}
