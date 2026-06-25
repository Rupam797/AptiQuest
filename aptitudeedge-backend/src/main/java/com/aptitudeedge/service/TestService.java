package com.aptitudeedge.service;

import com.aptitudeedge.dto.request.TestCreateRequest;
import com.aptitudeedge.dto.request.TestSubmitRequest;
import com.aptitudeedge.dto.response.QuestionDTO;
import com.aptitudeedge.dto.response.ResultResponse;
import com.aptitudeedge.dto.response.TestAttemptDTO;
import com.aptitudeedge.dto.response.TestDTO;
import com.aptitudeedge.model.*;
import com.aptitudeedge.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestService {

    private final TestRepository testRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionService questionService;

    public TestService(TestRepository testRepository,
                       TestAttemptRepository testAttemptRepository,
                       QuestionRepository questionRepository,
                       UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       QuestionService questionService) {
        this.testRepository = testRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.questionService = questionService;
    }

    public List<TestDTO> getAllTests() {
        return testRepository.findAll().stream().map(this::toDtoShort).collect(Collectors.toList());
    }

    public TestDTO getTestById(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test not found"));
        return toDtoFull(test);
    }

    public TestDTO createTest(TestCreateRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        }

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        if (questions.isEmpty()) {
            throw new IllegalArgumentException("No valid questions found for test creation");
        }

        Test test = new Test();
        test.setName(request.getName());
        test.setDescription(request.getDescription());
        test.setDuration(request.getDuration());
        test.setCategory(category);
        test.setQuestions(questions);

        return toDtoFull(testRepository.save(test));
    }

    public ResultResponse submitTest(TestSubmitRequest request) {
        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new IllegalArgumentException("Test not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        int correct = 0;
        int total = test.getQuestions().size();

        for (Question question : test.getQuestions()) {
            String answer = request.getAnswers().get(question.getId());
            if (answer != null && question.getCorrectAnswer().equalsIgnoreCase(answer.trim())) {
                correct++;
            }
        }

        TestAttempt attempt = new TestAttempt();
        attempt.setUser(user);
        attempt.setTest(test);
        attempt.setScore(correct);
        attempt.setTotalQuestions(total);
        attempt.setCorrectAnswers(correct);
        attempt.setTimeTaken(300); // 5 minutes default placeholder
        attempt.setSubmittedAt(LocalDateTime.now());
        testAttemptRepository.save(attempt);

        ResultResponse response = new ResultResponse();
        response.setTestId(test.getId());
        response.setTotalQuestions(total);
        response.setCorrectAnswers(correct);
        response.setScore(correct);
        return response;
    }

    public List<TestAttemptDTO> getUserTestAttempts() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return testAttemptRepository.findByUserIdOrderBySubmittedAtDesc(user.getId()).stream()
                .map(this::toAttemptDto)
                .collect(Collectors.toList());
    }

    private TestDTO toDtoShort(Test test) {
        TestDTO dto = new TestDTO();
        dto.setId(test.getId());
        dto.setName(test.getName());
        dto.setDescription(test.getDescription());
        dto.setDuration(test.getDuration());
        dto.setCategoryName(test.getCategory() != null ? test.getCategory().getName() : "Mixed");
        dto.setQuestions(new ArrayList<>());
        return dto;
    }

    private TestDTO toDtoFull(Test test) {
        TestDTO dto = new TestDTO();
        dto.setId(test.getId());
        dto.setName(test.getName());
        dto.setDescription(test.getDescription());
        dto.setDuration(test.getDuration());
        dto.setCategoryName(test.getCategory() != null ? test.getCategory().getName() : "Mixed");
        dto.setQuestions(test.getQuestions().stream().map(questionService::toDto).collect(Collectors.toList()));
        return dto;
    }

    private TestAttemptDTO toAttemptDto(TestAttempt attempt) {
        TestAttemptDTO dto = new TestAttemptDTO();
        dto.setId(attempt.getId());
        dto.setTestId(attempt.getTest().getId());
        dto.setTestName(attempt.getTest().getName());
        dto.setScore(attempt.getScore());
        dto.setTotalQuestions(attempt.getTotalQuestions());
        dto.setCorrectAnswers(attempt.getCorrectAnswers());
        dto.setTimeTaken(attempt.getTimeTaken());
        dto.setSubmittedAt(attempt.getSubmittedAt());
        return dto;
    }
}
