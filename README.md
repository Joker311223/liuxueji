# 🤖 AI知识库助手

一个基于GPT-5 Mini的智能知识库问答系统，支持自定义知识库配置，提供流畅的AI交互体验。

## ✨ 核心特性

- 🎨 **现代化UI设计** - 使用React + Framer Motion实现流畅动画效果
- 💬 **流式对话响应** - 实时打字机效果，交互体验丝滑
- 📚 **知识库管理** - 支持创建、上传、配置多个知识库
- 🤖 **GPT-5 Mini集成** - 基于最新AI大模型的智能问答
- ⚙️ **灵活配置** - 可调节Temperature、Max Tokens等AI参数
- 📝 **对话历史** - 自动保存和管理对话记录
- 🔍 **智能检索** - 基于知识库内容的上下文增强回答

## 🏗️ 技术栈

### 前端
- **React 18** - 现代化UI框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 流畅动画库
- **Zustand** - 轻量级状态管理
- **React Markdown** - Markdown渲染
- **Axios** - HTTP客户端

### 后端
- **Spring Boot 3.2** - Java后端框架
- **MyBatis** - 持久层框架
- **MySQL** - 关系型数据库
- **OpenAI Java Client** - GPT API集成
- **Apache Tika** - 文档解析

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### 1. 数据库配置

```bash
# 创建数据库
mysql -u root -p < server/src/main/resources/schema.sql
```

### 2. 后端配置

编辑 `server/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_knowledge
    username: your_username
    password: your_password

openai:
  api-key: your-openai-api-key  # 替换为你的OpenAI API Key
  model: gpt-3.5-turbo          # 或 gpt-4
```

### 3. 启动后端

```bash
cd server
mvn clean install
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 4. 启动前端

```bash
cd front
npm install
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 📖 使用指南

### 创建知识库

1. 点击左侧导航栏的 **📚 知识库** 图标
2. 点击右上角 **创建知识库** 按钮
3. 填写知识库名称和描述
4. 点击 **创建** 完成

### 上传文档

1. 在知识库卡片上点击 **上传** 按钮
2. 选择文档文件（支持 TXT, PDF, DOC, DOCX, MD）
3. 等待文件处理完成

### 开始对话

1. 点击左侧导航栏的 **💬 对话** 图标
2. 在知识库页面选择一个知识库
3. 在输入框输入问题，按回车或点击发送
4. AI将基于知识库内容回答你的问题

### 调整AI参数

1. 点击右上角的 **⚙️ 设置** 按钮
2. 调整以下参数：
   - **Temperature**: 控制回答的创造性（0-2）
   - **Max Tokens**: 限制回答的最大长度
   - **Top P**: 控制词汇选择的多样性（0-1）

## 🎨 界面预览

### 对话界面
- 流畅的打字机效果
- Markdown格式支持
- 代码高亮显示
- 实时响应动画

### 知识库管理
- 卡片式布局
- 拖拽上传
- 进度显示
- 文件管理

## 📁 项目结构

```
liuxueji/
├── front/                    # 前端项目
│   ├── src/
│   │   ├── api/             # API接口
│   │   ├── components/      # React组件
│   │   ├── pages/           # 页面组件
│   │   ├── store/           # 状态管理
│   │   └── App.jsx          # 主应用
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # 后端项目
│   ├── src/main/
│   │   ├── java/com/liuxueji/aiknowledge/
│   │   │   ├── config/      # 配置类
│   │   │   ├── controller/  # 控制器
│   │   │   ├── dto/         # 数据传输对象
│   │   │   ├── entity/      # 实体类
│   │   │   ├── mapper/      # MyBatis映射器
│   │   │   └── service/     # 业务逻辑
│   │   └── resources/
│   │       ├── application.yml
│   │       └── schema.sql
│   └── pom.xml
│
└── README.md
```

## 🔧 API接口

### 知识库管理

- `GET /api/knowledge/list` - 获取知识库列表
- `POST /api/knowledge/create` - 创建知识库
- `DELETE /api/knowledge/{id}` - 删除知识库
- `POST /api/knowledge/upload` - 上传文件
- `GET /api/knowledge/{id}/files` - 获取文件列表

### 对话接口

- `POST /api/chat/stream` - 流式对话（SSE）
- `GET /api/chat/history` - 获取对话历史
- `DELETE /api/chat/history` - 清空对话历史

## 🎯 核心功能实现

### 流式响应

使用Server-Sent Events (SSE)实现实时流式响应：

```javascript
// 前端
await chatAPI.sendMessage(message, knowledgeId, config, (chunk) => {
  fullContent += chunk
  updateLastMessage(fullContent)
})
```

```java
// 后端
@PostMapping("/stream")
public SseEmitter streamChat(@RequestBody ChatRequest request) {
    return chatService.streamChat(request);
}
```

### 知识库检索

1. 文档上传后自动分块处理
2. 用户提问时检索相关片段
3. 将相关内容作为上下文传递给GPT
4. GPT基于上下文生成回答

### 动画效果

使用Framer Motion实现：
- 页面切换动画
- 消息气泡动画
- 打字机效果
- 悬停和点击反馈

## 🔐 安全建议

1. **API Key保护**: 不要将OpenAI API Key提交到版本控制
2. **数据库安全**: 使用强密码，限制访问权限
3. **文件上传**: 限制文件大小和类型
4. **CORS配置**: 生产环境应限制允许的域名

## 🚧 后续优化方向

- [ ] 使用向量数据库（如Pinecone、Milvus）提升检索准确度
- [ ] 支持更多文档格式（PPT、Excel等）
- [ ] 添加用户认证和权限管理
- [ ] 支持多会话管理
- [ ] 添加对话导出功能
- [ ] 实现知识库共享
- [ ] 支持图片和语音输入
- [ ] 添加AI回答评分功能

## 📝 开发说明

### 前端开发

```bash
cd front
npm run dev      # 开发模式
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

### 后端开发

```bash
cd server
mvn spring-boot:run              # 运行
mvn clean package                # 打包
java -jar target/*.jar           # 运行jar包
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

刘雪霁

---

**享受与AI的智能对话吧！** 🎉
