package com.aptitudeedge.repository;

import com.aptitudeedge.model.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByUserIdOrderBySubmittedAtDesc(Long userId);
}
