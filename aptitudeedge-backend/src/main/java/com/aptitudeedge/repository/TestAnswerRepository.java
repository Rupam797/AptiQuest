package com.aptitudeedge.repository;

import com.aptitudeedge.model.TestAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestAnswerRepository extends JpaRepository<TestAnswer, Long> {
}
