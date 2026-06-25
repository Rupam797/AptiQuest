package com.aptitudeedge.repository;

import com.aptitudeedge.model.Formula;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormulaRepository extends JpaRepository<Formula, Long> {
    List<Formula> findByCategoryIgnoreCase(String category);
}
