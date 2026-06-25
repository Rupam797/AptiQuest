package com.aptitudeedge.repository;

import com.aptitudeedge.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
