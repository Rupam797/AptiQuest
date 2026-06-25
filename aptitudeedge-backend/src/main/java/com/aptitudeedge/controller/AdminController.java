package com.aptitudeedge.controller;

import com.aptitudeedge.dto.request.QuestionCreateRequest;
import com.aptitudeedge.dto.request.TestCreateRequest;
import com.aptitudeedge.dto.response.QuestionDTO;
import com.aptitudeedge.dto.response.TestDTO;
import com.aptitudeedge.service.QuestionService;
import com.aptitudeedge.service.TestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final QuestionService questionService;
    private final TestService testService;

    public AdminController(QuestionService questionService, TestService testService) {
        this.questionService = questionService;
        this.testService = testService;
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionDTO> createQuestion(@Valid @RequestBody QuestionCreateRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(request));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tests")
    public ResponseEntity<TestDTO> createTest(@Valid @RequestBody TestCreateRequest request) {
        return ResponseEntity.ok(testService.createTest(request));
    }
}
