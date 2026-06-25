package com.aptitudeedge.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class TestSubmitRequest {

    @NotNull
    private Long testId;

    @NotNull
    private Map<Long, String> answers;

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
