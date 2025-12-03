import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ChatPage from './pages/ChatPage'
import KnowledgePage from './pages/KnowledgePage'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
