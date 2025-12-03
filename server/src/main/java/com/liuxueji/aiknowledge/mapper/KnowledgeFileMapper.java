package com.liuxueji.aiknowledge.mapper;

import com.liuxueji.aiknowledge.entity.KnowledgeFile;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface KnowledgeFileMapper {
    
    @Select("SELECT * FROM knowledge_file WHERE knowledge_id = #{knowledgeId} ORDER BY created_at DESC")
    List<KnowledgeFile> selectByKnowledgeId(Long knowledgeId);
    
    @Select("SELECT * FROM knowledge_file WHERE id = #{id}")
    KnowledgeFile selectById(Long id);
    
    @Insert("INSERT INTO knowledge_file (knowledge_id, file_name, file_path, file_size, file_type, status) " +
            "VALUES (#{knowledgeId}, #{fileName}, #{filePath}, #{fileSize}, #{fileType}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(KnowledgeFile file);
    
    @Update("UPDATE knowledge_file SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);
    
    @Delete("DELETE FROM knowledge_file WHERE id = #{id}")
    int deleteById(Long id);
}
