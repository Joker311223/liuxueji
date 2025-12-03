import api from './axios'

export const chatAPI = {
  // 发送消息（流式响应）
  sendMessage: async (message, knowledgeId, config, onChunk) => {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        knowledgeId,
        config,
      }),
    })

    if (!response.ok) {
      throw new Error('Stream request failed')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return
          }
          try {
            const parsed = JSON.parse(data)
            onChunk(parsed.content)
          } catch (e) {
            console.error('Parse error:', e)
          }
        }
      }
    }
  },

  // 获取对话历史
  getHistory: () => api.get('/chat/history'),

  // 清空对话历史
  clearHistory: () => api.delete('/chat/history'),
}
