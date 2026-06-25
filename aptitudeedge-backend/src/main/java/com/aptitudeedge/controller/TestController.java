package com.aptitudeedge.controller;

import com.aptitudeedge.dto.request.TestSubmitRequest;
import com.aptitudeedge.dto.response.ResultResponse;
import com.aptitudeedge.dto.response.TestAttemptDTO;
import com.aptitudeedge.dto.response.TestDTO;
import com.aptitudeedge.service.TestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    public ResponseEntity<List<TestDTO>> getAllTests() {
        return ResponseEntity.ok(testService.getAllTests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestDTO> getTestById(@PathVariable Long id) {
        return ResponseEntity.ok(testService.getTestById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<ResultResponse> submitTest(@Valid @RequestBody TestSubmitRequest request) {
        return ResponseEntity.ok(testService.submitTest(request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TestAttemptDTO>> getTestHistory() {
        return ResponseEntity.ok(testService.getUserTestAttempts());
    }
}
