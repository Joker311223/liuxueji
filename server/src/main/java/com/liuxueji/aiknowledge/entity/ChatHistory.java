package com.liuxueji.aiknowledge.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatHistory {
    private Long id;
    private String sessionId;
    private String role;
    private String content;
    private Long knowledgeId;
    private LocalDateTime createdAt;
}
