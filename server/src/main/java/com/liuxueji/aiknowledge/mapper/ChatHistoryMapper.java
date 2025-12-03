package com.liuxueji.aiknowledge.mapper;

import com.liuxueji.aiknowledge.entity.ChatHistory;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ChatHistoryMapper {
    
    @Select("SELECT * FROM chat_history WHERE session_id = #{sessionId} ORDER BY created_at")
    List<ChatHistory> selectBySessionId(String sessionId);
    
    @Insert("INSERT INTO chat_history (session_id, role, content, knowledge_id) " +
            "VALUES (#{sessionId}, #{role}, #{content}, #{knowledgeId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ChatHistory history);
    
    @Delete("DELETE FROM chat_history WHERE session_id = #{sessionId}")
    int deleteBySessionId(String sessionId);
}
