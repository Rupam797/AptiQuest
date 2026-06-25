package com.aptitudeedge.controller;

import com.aptitudeedge.dto.request.QuestionCreateRequest;
import com.aptitudeedge.dto.response.QuestionDTO;
import com.aptitudeedge.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> listQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@Valid @RequestBody QuestionCreateRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(request));
    }
}
