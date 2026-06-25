package com.aptitudeedge.service;

import com.aptitudeedge.model.Bookmark;
import com.aptitudeedge.model.Question;
import com.aptitudeedge.model.User;
import com.aptitudeedge.repository.BookmarkRepository;
import com.aptitudeedge.repository.QuestionRepository;
import com.aptitudeedge.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, QuestionRepository questionRepository, UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    public void bookmarkQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        Bookmark bookmark = new Bookmark();
        bookmark.setQuestion(question);
        bookmark.setUser(user);
        bookmarkRepository.save(bookmark);
    }

    public List<Long> getBookmarks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return bookmarkRepository.findByUserId(user.getId()).stream()
                .map(bookmark -> bookmark.getQuestion().getId())
                .collect(Collectors.toList());
    }
}
