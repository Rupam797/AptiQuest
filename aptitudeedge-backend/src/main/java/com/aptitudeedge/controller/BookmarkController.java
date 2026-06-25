package com.aptitudeedge.controller;

import com.aptitudeedge.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/{questionId}")
    public ResponseEntity<Void> bookmarkQuestion(@PathVariable Long questionId) {
        bookmarkService.bookmarkQuestion(questionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getBookmarks() {
        return ResponseEntity.ok(bookmarkService.getBookmarks());
    }
}
