package com.liuxueji.aiknowledge.mapper;

import com.liuxueji.aiknowledge.entity.DocumentChunk;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface DocumentChunkMapper {
    
    @Select("SELECT * FROM document_chunk WHERE file_id = #{fileId} ORDER BY chunk_index")
    List<DocumentChunk> selectByFileId(Long fileId);
    
    @Insert("INSERT INTO document_chunk (file_id, content, chunk_index, token_count) " +
            "VALUES (#{fileId}, #{content}, #{chunkIndex}, #{tokenCount})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(DocumentChunk chunk);
    
    @Delete("DELETE FROM document_chunk WHERE file_id = #{fileId}")
    int deleteByFileId(Long fileId);
    
    // 简单的关键词搜索 (实际项目中应使用向量数据库)
    @Select("SELECT * FROM document_chunk WHERE file_id IN " +
            "(SELECT id FROM knowledge_file WHERE knowledge_id = #{knowledgeId}) " +
            "AND content LIKE CONCAT('%', #{keyword}, '%') LIMIT #{limit}")
    List<DocumentChunk> searchByKeyword(@Param("knowledgeId") Long knowledgeId, 
                                       @Param("keyword") String keyword, 
                                       @Param("limit") int limit);
}
