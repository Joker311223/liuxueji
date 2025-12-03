package com.liuxueji.aiknowledge.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class KnowledgeFile {
    private Long id;
    private Long knowledgeId;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private Integer status; // 0-处理中, 1-已完成, 2-失败
    private LocalDateTime createdAt;
}
