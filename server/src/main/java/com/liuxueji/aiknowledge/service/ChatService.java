package com.liuxueji.aiknowledge.service;

import com.liuxueji.aiknowledge.dto.ChatRequest;
import com.liuxueji.aiknowledge.entity.ChatHistory;
import com.liuxueji.aiknowledge.entity.DocumentChunk;
import com.liuxueji.aiknowledge.mapper.ChatHistoryMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final KnowledgeService knowledgeService;
    private final ChatHistoryMapper chatHistoryMapper;
    
    @Value("${openai.api-key}")
    private String apiKey;
    
    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;
    
    private static final String SESSION_ID = "default-session";
    
    public SseEmitter streamChat(ChatRequest request) {
        SseEmitter emitter = new SseEmitter(60000L);
        
        new Thread(() -> {
            try {
                // 保存用户消息
                saveMessage(SESSION_ID, "user", request.getMessage(), request.getKnowledgeId());
                
                // 构建上下文
                List<ChatMessage> messages = buildMessages(request);
                
                // 调用OpenAI API
                OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(60));
                
                ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                        .model(model)
                        .messages(messages)
                        .temperature(request.getConfig().getTemperature())
                        .maxTokens(request.getConfig().getMaxTokens())
                        .topP(request.getConfig().getTopP())
                        .stream(true)
                        .build();
                
                StringBuilder fullResponse = new StringBuilder();
                
                service.streamChatCompletion(completionRequest)
                        .doOnError(error -> {
                            log.error("OpenAI API error", error);
                            emitter.completeWithError(error);
                        })
                        .blockingForEach(chunk -> {
                            if (chunk.getChoices() != null && !chunk.getChoices().isEmpty()) {
                                String content = chunk.getChoices().get(0).getMessage().getContent();
                                if (content != null) {
                                    fullResponse.append(content);
                                    emitter.send(SseEmitter.event()
                                            .data("{\"content\":\"" + escapeJson(content) + "\"}")
                                            .name("message"));
                                }
                            }
                        });
                
                // 保存AI回复
                saveMessage(SESSION_ID, "assistant", fullResponse.toString(), request.getKnowledgeId());
                
                emitter.send(SseEmitter.event().data("[DONE]").name("done"));
                emitter.complete();
                
            } catch (Exception e) {
                log.error("Error in stream chat", e);
                try {
                    emitter.send(SseEmitter.event()
                            .data("{\"error\":\"" + e.getMessage() + "\"}")
                            .name("error"));
                } catch (IOException ex) {
                    log.error("Error sending error event", ex);
                }
                emitter.completeWithError(e);
            }
        }).start();
        
        return emitter;
    }
    
    private List<ChatMessage> buildMessages(ChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        
        // 添加系统提示
        String systemPrompt = "你是一个有帮助的AI助手。";
        
        // 如果有知识库，添加相关上下文
        if (request.getKnowledgeId() != null) {
            List<DocumentChunk> relevantChunks = knowledgeService.searchRelevantChunks(
                    request.getKnowledgeId(), 
                    request.getMessage(), 
                    3
            );
            
            if (!relevantChunks.isEmpty()) {
                String context = relevantChunks.stream()
                        .map(DocumentChunk::getContent)
                        .collect(Collectors.joining("\n\n"));
                
                systemPrompt += "\n\n以下是相关的知识库内容，请基于这些内容回答用户的问题：\n\n" + context;
            }
        }
        
        messages.add(new ChatMessage(ChatMessageRole.SYSTEM.value(), systemPrompt));
        
        // 添加历史对话 (最近5条)
        List<ChatHistory> history = chatHistoryMapper.selectBySessionId(SESSION_ID);
        int startIndex = Math.max(0, history.size() - 5);
        for (int i = startIndex; i < history.size(); i++) {
            ChatHistory h = history.get(i);
            messages.add(new ChatMessage(h.getRole(), h.getContent()));
        }
        
        // 添加当前用户消息
        messages.add(new ChatMessage(ChatMessageRole.USER.value(), request.getMessage()));
        
        return messages;
    }
    
    private void saveMessage(String sessionId, String role, String content, Long knowledgeId) {
        ChatHistory history = new ChatHistory();
        history.setSessionId(sessionId);
        history.setRole(role);
        history.setContent(content);
        history.setKnowledgeId(knowledgeId);
        chatHistoryMapper.insert(history);
    }
    
    public List<ChatHistory> getHistory() {
        return chatHistoryMapper.selectBySessionId(SESSION_ID);
    }
    
    public void clearHistory() {
        chatHistoryMapper.deleteBySessionId(SESSION_ID);
    }
    
    private String escapeJson(String str) {
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
