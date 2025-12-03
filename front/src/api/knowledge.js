import api from './axios'

export const knowledgeAPI = {
  // 获取知识库列表
  getList: () => api.get('/knowledge/list'),

  // 创建知识库
  create: (data) => api.post('/knowledge/create', data),

  // 上传文件到知识库
  uploadFile: (knowledgeId, file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('knowledgeId', knowledgeId)

    return api.post('/knowledge/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress?.(percentCompleted)
      },
    })
  },

  // 删除知识库
  delete: (id) => api.delete(`/knowledge/${id}`),

  // 获取知识库详情
  getDetail: (id) => api.get(`/knowledge/${id}`),

  // 获取知识库文件列表
  getFiles: (knowledgeId) => api.get(`/knowledge/${knowledgeId}/files`),

  // 删除知识库文件
  deleteFile: (fileId) => api.delete(`/knowledge/file/${fileId}`),
}
