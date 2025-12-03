package com.liuxueji.aiknowledge.controller;

import com.liuxueji.aiknowledge.dto.ApiResponse;
import com.liuxueji.aiknowledge.entity.KnowledgeBase;
import com.liuxueji.aiknowledge.entity.KnowledgeFile;
import com.liuxueji.aiknowledge.service.KnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnowledgeController {
    
    private final KnowledgeService knowledgeService;
    
    @GetMapping("/list")
    public ApiResponse<List<KnowledgeBase>> getList() {
        return ApiResponse.success(knowledgeService.getAllKnowledgeBases());
    }
    
    @GetMapping("/{id}")
    public ApiResponse<KnowledgeBase> getDetail(@PathVariable Long id) {
        return ApiResponse.success(knowledgeService.getKnowledgeBase(id));
    }
    
    @PostMapping("/create")
    public ApiResponse<KnowledgeBase> create(@RequestBody KnowledgeBase knowledgeBase) {
        return ApiResponse.success(knowledgeService.createKnowledgeBase(knowledgeBase));
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        knowledgeService.deleteKnowledgeBase(id);
        return ApiResponse.success(null);
    }
    
    @GetMapping("/{knowledgeId}/files")
    public ApiResponse<List<KnowledgeFile>> getFiles(@PathVariable Long knowledgeId) {
        return ApiResponse.success(knowledgeService.getKnowledgeFiles(knowledgeId));
    }
    
    @PostMapping("/upload")
    public ApiResponse<KnowledgeFile> uploadFile(
            @RequestParam("knowledgeId") Long knowledgeId,
            @RequestParam("file") MultipartFile file) {
        try {
            return ApiResponse.success(knowledgeService.uploadFile(knowledgeId, file));
        } catch (Exception e) {
            return ApiResponse.error("文件上传失败: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/file/{fileId}")
    public ApiResponse<Void> deleteFile(@PathVariable Long fileId) {
        knowledgeService.deleteFile(fileId);
        return ApiResponse.success(null);
    }
}
