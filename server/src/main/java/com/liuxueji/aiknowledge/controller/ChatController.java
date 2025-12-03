package com.liuxueji.aiknowledge.controller;

import com.liuxueji.aiknowledge.dto.ApiResponse;
import com.liuxueji.aiknowledge.dto.ChatRequest;
import com.liuxueji.aiknowledge.entity.ChatHistory;
import com.liuxueji.aiknowledge.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final ChatService chatService;
    
    @PostMapping("/stream")
    public SseEmitter streamChat(@RequestBody ChatRequest request) {
        return chatService.streamChat(request);
    }
    
    @GetMapping("/history")
    public ApiResponse<List<ChatHistory>> getHistory() {
        return ApiResponse.success(chatService.getHistory());
    }
    
    @DeleteMapping("/history")
    public ApiResponse<Void> clearHistory() {
        chatService.clearHistory();
        return ApiResponse.success(null);
    }
}
