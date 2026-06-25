package com.aptitudeedge.service;

import com.aptitudeedge.model.Formula;
import com.aptitudeedge.repository.FormulaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FormulaService {

    private final FormulaRepository formulaRepository;

    public FormulaService(FormulaRepository formulaRepository) {
        this.formulaRepository = formulaRepository;
    }

    public List<Formula> getAllFormulas() {
        return formulaRepository.findAll();
    }

    public List<Formula> getFormulasByCategory(String category) {
        return formulaRepository.findByCategoryIgnoreCase(category);
    }

    public Formula createFormula(Formula formula) {
        return formulaRepository.save(formula);
    }

    public void deleteFormula(Long id) {
        formulaRepository.deleteById(id);
    }
}
