import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, BookOpen, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: MessageSquare, label: '对话' },
    { path: '/knowledge', icon: BookOpen, label: '知识库' },
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 桌面端侧边栏 */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex w-20 bg-white shadow-lg flex-col items-center py-8 space-y-8"
      >
        <div className="text-3xl font-bold text-primary-600">🤖</div>
        
        <nav className="flex-1 flex flex-col space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={24} />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
        >
          <Settings size={24} />
        </motion.button>
      </motion.aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        {children}
      </main>

      {/* 移动端底部导航栏 */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      >
        <div className="flex items-center justify-around px-4 py-3 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`
                    p-2 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-600'
                    }
                  `}>
                    <Icon size={22} />
                  </div>
                  <span className={`
                    text-xs font-medium
                    ${isActive ? 'text-primary-600' : 'text-gray-500'}
                  `}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
}

export default Layout
