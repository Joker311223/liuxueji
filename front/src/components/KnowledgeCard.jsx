import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, CheckCircle, FileText } from 'lucide-react'

const KnowledgeCard = ({ knowledge, onSelect, onUpload, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
               border-2 border-gray-100 overflow-hidden"
    >
      {/* 头部渐变 */}
      <div className="h-24 bg-gradient-to-br from-primary-400 to-primary-600 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{knowledge.name}</h3>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {knowledge.description || '暂无描述'}
        </p>

        {/* 统计信息 */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <FileText size={16} />
            <span>{knowledge.fileCount || 0} 个文件</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="text-gray-500">
            {new Date(knowledge.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(knowledge)}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg
                     hover:bg-primary-600 transition-colors duration-200
                     flex items-center justify-center gap-2 text-sm font-medium"
          >
            <CheckCircle size={16} />
            <span>选择</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpload(knowledge)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                     hover:bg-gray-200 transition-colors duration-200"
          >
            <Upload size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(knowledge.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg
                     hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default KnowledgeCard
