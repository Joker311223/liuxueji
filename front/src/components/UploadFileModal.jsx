import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, File, CheckCircle } from 'lucide-react'
import { knowledgeAPI } from '../api/knowledge'
import toast from 'react-hot-toast'

const UploadFileModal = ({ isOpen, knowledge, onClose, onComplete }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !knowledge) return

    try {
      setUploading(true)
      await knowledgeAPI.uploadFile(knowledge.id, file, (percent) => {
        setProgress(percent)
      })
      
      toast.success('文件上传成功！')
      setFile(null)
      setProgress(0)
      onComplete()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('文件上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setFile(null)
      setProgress(0)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 模态框 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              上传文件到 {knowledge?.name}
            </h2>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-4">
            {/* 文件选择区域 */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200
                ${file 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                accept=".txt,.pdf,.doc,.docx,.md"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <File size={48} className="text-primary-500" />
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={48} className="text-gray-400" />
                  <p className="font-medium text-gray-700">点击选择文件</p>
                  <p className="text-sm text-gray-500">
                    支持 TXT, PDF, DOC, DOCX, MD
                  </p>
                </div>
              )}
            </div>

            {/* 上传进度 */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">上传中...</span>
                  <span className="text-primary-600 font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500"
                  />
                </div>
              </motion.div>
            )}

            {/* 按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700
                         rounded-lg hover:bg-gray-50 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg
                         hover:bg-primary-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>上传中...</>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>上传</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UploadFileModal
