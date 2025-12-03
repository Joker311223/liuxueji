package com.liuxueji.aiknowledge.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private Long knowledgeId;
    private ChatConfig config;
    
    @Data
    public static class ChatConfig {
        private Double temperature = 0.7;
        private Integer maxTokens = 2000;
        private Double topP = 1.0;
    }
}
