package com.aptitudeedge.repository;

import com.aptitudeedge.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, Long> {
}
