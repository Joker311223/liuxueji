package com.liuxueji.aiknowledge;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.liuxueji.aiknowledge.mapper")
public class AiKnowledgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiKnowledgeApplication.class, args);
    }
}
