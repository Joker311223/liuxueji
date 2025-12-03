package com.liuxueji.aiknowledge.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class KnowledgeBase {
    private Long id;
    private String name;
    private String description;
    private Integer fileCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
