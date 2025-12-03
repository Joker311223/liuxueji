import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Sliders } from 'lucide-react'
import useChatStore from '../store/chatStore'

const ConfigPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { config, updateConfig } = useChatStore()

  return (
    <>
      {/* 打开按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-8 top-24 p-4 bg-white rounded-full shadow-lg
                   hover:shadow-xl transition-all duration-200 z-10"
        >
          <Settings size={24} className="text-gray-600" />
        </motion.button>
      )}

      {/* 配置面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col"
          >
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-800">AI配置</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* 配置项 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (创造性)
                  <span className="ml-2 text-primary-600 font-semibold">
                    {config.temperature}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                           accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>精确</span>
                  <span>创造</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大Token数
                  <span className="ml-2 text-primary-600 font-semibold">
                    {config.maxTokens}
                  </span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={config.maxTokens}
                  onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                           accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>4000</span>
                </div>
              </div>

              {/* Top P */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top P (采样范围)
                  <span className="ml-2 text-primary-600 font-semibold">
                    {config.topP}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.topP}
                  onChange={(e) => updateConfig({ topP: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                           accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>1</span>
                </div>
              </div>

              {/* 说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 参数说明</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• <strong>Temperature</strong>: 控制回答的随机性，越高越有创造性</li>
                  <li>• <strong>Max Tokens</strong>: 限制回答的最大长度</li>
                  <li>• <strong>Top P</strong>: 控制词汇选择的多样性</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ConfigPanel
