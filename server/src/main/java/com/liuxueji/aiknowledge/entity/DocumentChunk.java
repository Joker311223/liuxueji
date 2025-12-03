package com.liuxueji.aiknowledge.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentChunk {
    private Long id;
    private Long fileId;
    private String content;
    private Integer chunkIndex;
    private Integer tokenCount;
    private LocalDateTime createdAt;
}
