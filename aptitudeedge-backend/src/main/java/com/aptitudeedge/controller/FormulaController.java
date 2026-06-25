package com.aptitudeedge.controller;

import com.aptitudeedge.model.Formula;
import com.aptitudeedge.service.FormulaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formulas")
public class FormulaController {

    private final FormulaService formulaService;

    public FormulaController(FormulaService formulaService) {
        this.formulaService = formulaService;
    }

    @GetMapping
    public ResponseEntity<List<Formula>> getAllFormulas(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(formulaService.getFormulasByCategory(category));
        }
        return ResponseEntity.ok(formulaService.getAllFormulas());
    }

    @PostMapping
    public ResponseEntity<Formula> createFormula(@RequestBody Formula formula) {
        return ResponseEntity.ok(formulaService.createFormula(formula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormula(@PathVariable Long id) {
        formulaService.deleteFormula(id);
        return ResponseEntity.noContent().build();
    }
}
