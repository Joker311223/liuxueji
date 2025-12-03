import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Sparkles } from 'lucide-react'
import useChatStore from '../store/chatStore'
import { chatAPI } from '../api/chat'
import MessageBubble from '../components/MessageBubble'
import ConfigPanel from '../components/ConfigPanel'
import toast from 'react-hot-toast'

const ChatPage = () => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { 
    messages, 
    isStreaming, 
    currentKnowledge,
    config,
    addMessage, 
    updateLastMessage, 
    setStreaming 
  } = useChatStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    
    // 添加用户消息
    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    })

    // 添加AI消息占位符
    addMessage({
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    })

    setStreaming(true)

    try {
      let fullContent = ''
      
      await chatAPI.sendMessage(
        userMessage,
        currentKnowledge?.id,
        config,
        (chunk) => {
          fullContent += chunk
          updateLastMessage(fullContent)
        }
      )
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('发送消息失败，请重试')
      updateLastMessage('抱歉，我遇到了一些问题，请稍后再试。')
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full">
      {/* 聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 头部 */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm px-8 py-4 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-primary-500" size={28} />
              LXJ答疑工具
            </h1>
            {currentKnowledge && (
              <p className="text-sm text-gray-500 mt-1">
                当前知识库: <span className="text-primary-600 font-medium">{currentKnowledge.name}</span>
              </p>
            )}
          </div>
        </motion.header>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                你好！LXJ客服
              </h2>
              <p className="text-gray-500 max-w-md">
                我可以基于你配置的知识库回答问题。开始对话吧！
              </p>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id || index}
                    message={message}
                    isStreaming={isStreaming && index === messages.length - 1}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-t border-gray-200 px-8 py-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入你的问题..."
                  disabled={isStreaming}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl 
                           focus:border-primary-500 focus:outline-none resize-none
                           disabled:bg-gray-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="px-6 py-3 bg-primary-500 text-white rounded-2xl
                         hover:bg-primary-600 disabled:bg-gray-300 
                         disabled:cursor-not-allowed transition-all duration-200
                         flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isStreaming ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>思考中</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>发送</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 配置面板 */}
      <ConfigPanel />
    </div>
  )
}

export default ChatPage
