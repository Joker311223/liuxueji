import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Upload, Trash2, FileText, Loader2, Database } from 'lucide-react'
import { knowledgeAPI } from '../api/knowledge'
import useChatStore from '../store/chatStore'
import toast from 'react-hot-toast'
import KnowledgeCard from '../components/KnowledgeCard'
import CreateKnowledgeModal from '../components/CreateKnowledgeModal'
import UploadFileModal from '../components/UploadFileModal'

const KnowledgePage = () => {
  const [knowledgeList, setKnowledgeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState(null)
  
  const { setCurrentKnowledge } = useChatStore()

  useEffect(() => {
    loadKnowledgeList()
  }, [])

  const loadKnowledgeList = async () => {
    try {
      setLoading(true)
      const data = await knowledgeAPI.getList()
      setKnowledgeList(data)
    } catch (error) {
      console.error('Load knowledge list error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await knowledgeAPI.create(data)
      toast.success('知识库创建成功！')
      setShowCreateModal(false)
      loadKnowledgeList()
    } catch (error) {
      console.error('Create knowledge error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个知识库吗？')) return
    
    try {
      await knowledgeAPI.delete(id)
      toast.success('知识库已删除')
      loadKnowledgeList()
    } catch (error) {
      console.error('Delete knowledge error:', error)
    }
  }

  const handleSelect = (knowledge) => {
    setCurrentKnowledge(knowledge)
    toast.success(`已选择知识库: ${knowledge.name}`)
  }

  const handleUpload = (knowledge) => {
    setSelectedKnowledge(knowledge)
    setShowUploadModal(true)
  }

  const handleUploadComplete = () => {
    setShowUploadModal(false)
    setSelectedKnowledge(null)
    loadKnowledgeList()
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm px-8 py-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Database className="text-primary-500" size={28} />
            知识库管理
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            创建和管理你的AI知识库
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl
                   hover:bg-primary-600 transition-all duration-200
                   flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span>创建知识库</span>
        </motion.button>
      </motion.header>

      {/* 知识库列表 */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 size={48} className="animate-spin text-primary-500" />
          </div>
        ) : knowledgeList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              还没有知识库
            </h2>
            <p className="text-gray-500 max-w-md mb-6">
              创建你的第一个知识库，上传文档让AI学习
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl
                       hover:bg-primary-600 transition-all duration-200
                       flex items-center gap-2"
            >
              <Plus size={20} />
              <span>创建知识库</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              {knowledgeList.map((knowledge) => (
                <KnowledgeCard
                  key={knowledge.id}
                  knowledge={knowledge}
                  onSelect={handleSelect}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 创建知识库模态框 */}
      <CreateKnowledgeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* 上传文件模态框 */}
      <UploadFileModal
        isOpen={showUploadModal}
        knowledge={selectedKnowledge}
        onClose={() => setShowUploadModal(false)}
        onComplete={handleUploadComplete}
      />
    </div>
  )
}

export default KnowledgePage
