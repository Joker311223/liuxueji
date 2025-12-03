package com.liuxueji.aiknowledge.mapper;

import com.liuxueji.aiknowledge.entity.KnowledgeBase;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface KnowledgeBaseMapper {
    
    @Select("SELECT * FROM knowledge_base ORDER BY created_at DESC")
    List<KnowledgeBase> selectAll();
    
    @Select("SELECT * FROM knowledge_base WHERE id = #{id}")
    KnowledgeBase selectById(Long id);
    
    @Insert("INSERT INTO knowledge_base (name, description) VALUES (#{name}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(KnowledgeBase knowledgeBase);
    
    @Update("UPDATE knowledge_base SET file_count = file_count + 1 WHERE id = #{id}")
    int incrementFileCount(Long id);
    
    @Delete("DELETE FROM knowledge_base WHERE id = #{id}")
    int deleteById(Long id);
}
