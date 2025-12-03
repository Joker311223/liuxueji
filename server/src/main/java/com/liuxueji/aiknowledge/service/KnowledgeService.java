package com.liuxueji.aiknowledge.service;

import com.liuxueji.aiknowledge.entity.DocumentChunk;
import com.liuxueji.aiknowledge.entity.KnowledgeBase;
import com.liuxueji.aiknowledge.entity.KnowledgeFile;
import com.liuxueji.aiknowledge.mapper.DocumentChunkMapper;
import com.liuxueji.aiknowledge.mapper.KnowledgeBaseMapper;
import com.liuxueji.aiknowledge.mapper.KnowledgeFileMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeService {
    
    private final KnowledgeBaseMapper knowledgeBaseMapper;
    private final KnowledgeFileMapper knowledgeFileMapper;
    private final DocumentChunkMapper documentChunkMapper;
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    private final Tika tika = new Tika();
    
    public List<KnowledgeBase> getAllKnowledgeBases() {
        return knowledgeBaseMapper.selectAll();
    }
    
    public KnowledgeBase getKnowledgeBase(Long id) {
        return knowledgeBaseMapper.selectById(id);
    }
    
    @Transactional
    public KnowledgeBase createKnowledgeBase(KnowledgeBase knowledgeBase) {
        knowledgeBaseMapper.insert(knowledgeBase);
        return knowledgeBase;
    }
    
    @Transactional
    public void deleteKnowledgeBase(Long id) {
        knowledgeBaseMapper.deleteById(id);
    }
    
    public List<KnowledgeFile> getKnowledgeFiles(Long knowledgeId) {
        return knowledgeFileMapper.selectByKnowledgeId(knowledgeId);
    }
    
    @Transactional
    public KnowledgeFile uploadFile(Long knowledgeId, MultipartFile file) throws IOException {
        // 创建上传目录
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        
        // 保存文件
        file.transferTo(filePath.toFile());
        
        // 保存文件记录
        KnowledgeFile knowledgeFile = new KnowledgeFile();
        knowledgeFile.setKnowledgeId(knowledgeId);
        knowledgeFile.setFileName(originalFilename);
        knowledgeFile.setFilePath(filePath.toString());
        knowledgeFile.setFileSize(file.getSize());
        knowledgeFile.setFileType(file.getContentType());
        knowledgeFile.setStatus(0); // 处理中
        
        knowledgeFileMapper.insert(knowledgeFile);
        
        // 异步处理文件内容
        processFileAsync(knowledgeFile);
        
        // 更新知识库文件计数
        knowledgeBaseMapper.incrementFileCount(knowledgeId);
        
        return knowledgeFile;
    }
    
    private void processFileAsync(KnowledgeFile knowledgeFile) {
        new Thread(() -> {
            try {
                // 提取文件内容
                String content = tika.parseToString(new File(knowledgeFile.getFilePath()));
                
                // 分块处理 (简单按字符数分块，实际应该按语义分块)
                int chunkSize = 500;
                int index = 0;
                
                for (int i = 0; i < content.length(); i += chunkSize) {
                    int end = Math.min(i + chunkSize, content.length());
                    String chunkContent = content.substring(i, end);
                    
                    DocumentChunk chunk = new DocumentChunk();
                    chunk.setFileId(knowledgeFile.getId());
                    chunk.setContent(chunkContent);
                    chunk.setChunkIndex(index++);
                    chunk.setTokenCount(chunkContent.length() / 4); // 粗略估算
                    
                    documentChunkMapper.insert(chunk);
                }
                
                // 更新文件状态为已完成
                knowledgeFileMapper.updateStatus(knowledgeFile.getId(), 1);
                log.info("File processed successfully: {}", knowledgeFile.getFileName());
                
            } catch (Exception e) {
                log.error("Error processing file: {}", knowledgeFile.getFileName(), e);
                knowledgeFileMapper.updateStatus(knowledgeFile.getId(), 2);
            }
        }).start();
    }
    
    @Transactional
    public void deleteFile(Long fileId) {
        KnowledgeFile file = knowledgeFileMapper.selectById(fileId);
        if (file != null) {
            // 删除文件
            try {
                Files.deleteIfExists(Paths.get(file.getFilePath()));
            } catch (IOException e) {
                log.error("Error deleting file: {}", file.getFilePath(), e);
            }
            
            // 删除数据库记录
            documentChunkMapper.deleteByFileId(fileId);
            knowledgeFileMapper.deleteById(fileId);
        }
    }
    
    public List<DocumentChunk> searchRelevantChunks(Long knowledgeId, String query, int limit) {
        // 简单的关键词搜索 (实际项目应使用向量相似度搜索)
        return documentChunkMapper.searchByKeyword(knowledgeId, query, limit);
    }
}
