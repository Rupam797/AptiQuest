package com.aptitudeedge.service;

import com.aptitudeedge.dto.request.QuestionCreateRequest;
import com.aptitudeedge.dto.response.QuestionDTO;
import com.aptitudeedge.model.Category;
import com.aptitudeedge.model.Question;
import com.aptitudeedge.repository.CategoryRepository;
import com.aptitudeedge.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public QuestionService(QuestionRepository questionRepository, CategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public QuestionDTO createQuestion(QuestionCreateRequest request) {
        Category category = categoryRepository.findByName(request.getCategory())
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setName(request.getCategory());
                    return categoryRepository.save(newCategory);
                });

        Question question = new Question();
        question.setText(request.getText());
        question.setCategory(category);
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());

        return toDto(questionRepository.save(question));
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public QuestionDTO toDto(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setText(question.getText());
        dto.setCategory(question.getCategory() != null ? question.getCategory().getName() : null);
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setExplanation(question.getExplanation());
        return dto;
    }
}
