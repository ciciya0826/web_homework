# 待办工作台

## 项目概述

待办工作台是一个基于Web的任务管理系统，帮助用户高效地管理和跟踪日常任务。项目采用混合架构设计：

- **React主应用**：负责核心任务管理功能，使用现代化的React + TypeScript技术栈
- **HTML认证页面**：负责用户注册和登录，使用HTML + JavaScript实现，包含服务器端验证逻辑

两部分数据完全共享，提供无缝的用户体验，同时展示了不同Web开发技术的应用。

## 功能特性

### 用户认证系统（HTML实现）
- **用户注册**：HTML页面，支持客户端验证和服务器端验证逻辑
- **用户登录**：用户名密码验证，自动跳转
- **表单验证**：客户端JavaScript验证，模拟服务器端验证
- **数据存储**：localStorage本地存储，与React应用共享
- **调试功能**：提供数据清除功能，便于开发测试

### 任务管理系统（React实现）
- **待完成任务管理**：创建、编辑、删除和完成任务
- **已完成任务查看**：查看历史完成的任务记录
- **数据统计**：多维度统计分析任务完成情况
- **个性化设置**：自定义主题色和应用配置
- **任务计数**：侧边栏实时显示待完成和已完成任务数量

### 任务功能详情
- 任务创建时需输入：任务名称、开始时间、结束时间
- 任务状态管理（待完成、已完成）
- 任务搜索和筛选功能（全部/今日任务/今日截止/已截止）
- 任务排序功能（按开始时间/截止时间）
- 快捷日期选择（今天/明天/后天/一周后）
- 逾期任务标识和提醒
- 抽屉式任务编辑界面

### 界面特性
- 左侧导航栏，右侧内容区域的经典布局
- 响应式设计，适配不同屏幕尺寸
- 主题色系统，支持自定义颜色和圆角
- 友好的用户交互体验
- 中文界面，符合国内用户习惯
- 任务数量徽章显示

## 技术架构

### 混合架构设计
项目采用混合架构，结合了现代React开发和传统HTML开发的优势：

#### React主应用
- **React 18.2.0**：现代化的JavaScript UI框架
- **TypeScript 4.9.0**：提供类型安全的开发体验
- **Ant Design 5.12.0**：企业级UI设计语言和组件库
- **Day.js 1.11.0**：轻量级日期处理库
- **Context API**：React状态管理

#### HTML认证页面
- **HTML5**：现代化的标记语言
- **CSS3**：现代化样式设计和动画效果
- **JavaScript ES6+**：客户端交互和数据处理
- **localStorage API**：本地数据存储
- **表单验证**：客户端验证，模拟服务器端验证逻辑

### 数据共享机制
- 两部分使用相同的localStorage键名和数据结构
- HTML页面通过JavaScript操作localStorage
- React应用直接读取localStorage数据
- 登录状态在HTML页面和React应用间保持一致

### 项目结构
```
src/                    # React主应用源码
├── components/          # 可复用组件
│   ├── Sidebar.tsx     # 侧边导航栏（含用户信息和退出功能）
│   ├── TaskForm.tsx    # 任务表单
│   └── TaskItem.tsx    # 任务项组件
├── pages/              # 页面组件
│   ├── PendingTasks.tsx    # 待完成任务页面
│   ├── CompletedTasks.tsx  # 已完成任务页面
│   ├── Statistics.tsx      # 数据统计页面
│   └── Settings.tsx        # 设置页面
├── contexts/           # React Context
│   └── ThemeContext.tsx    # 主题上下文
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
│   └── storage.ts      # 数据存储工具类
├── styles/             # 样式文件
│   └── register.css    # ASP.NET页面样式
├── scripts/            # JavaScript脚本
│   └── register.js     # HTML页面客户端脚本
├── login.aspx          # ASP.NET登录页面（备用）
├── login.aspx.cs       # 登录页面后端代码（备用）
├── register.aspx       # ASP.NET注册页面（备用）
└── register.aspx.cs    # 注册页面后端代码（备用）

public/                 # 静态资源
├── index.html          # React应用入口
├── login.html          # HTML登录页面
├── register.html       # HTML注册页面
└── favicon.ico         # 网站图标
```

### 后端扩展支持
项目设计时考虑了后期添加数据库的扩展性：
- ASP.NET页面可轻松连接SQL Server等数据库
- 数据存储抽象层，便于从localStorage迁移到数据库
- 统一的数据模型定义
- 清晰的业务逻辑分离

## 运行环境

### React应用环境
- **Node.js**：16.0.0 或更高版本
- **npm**：8.0.0 或更高版本
- **现代浏览器**：Chrome 90+, Firefox 88+, Safari 14+

### HTML页面环境
- **现代浏览器**：支持HTML5和ES6+的浏览器
- **JavaScript**：ES6+ 支持
- **localStorage**：浏览器本地存储支持
- **无需服务器**：可直接在浏览器中运行

## 安装和运行

### 开发环境设置

#### 1. React应用
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

#### 2. HTML认证页面
HTML认证页面会自动通过React开发服务器提供服务，无需额外配置。

### 访问地址
- **React主应用**：`http://localhost:3000/`
- **HTML登录页面**：`http://localhost:3000/login.html`
- **HTML注册页面**：`http://localhost:3000/register.html`

## 用户使用流程

### 首次使用
1. **访问应用**：打开 `http://localhost:3000`
2. **自动跳转**：系统检测到无用户，跳转到HTML注册页面
3. **用户注册**：填写用户名和密码（客户端验证）
4. **自动登录**：注册成功后自动登录并跳转到React主应用

### 日常使用
1. **访问应用**：打开 `http://localhost:3000`
2. **登录验证**：如未登录，自动跳转到HTML登录页面
3. **任务管理**：登录后进入React主应用，管理任务
4. **安全退出**：点击用户名选择退出，返回HTML登录页面

## 页面功能详解

### 1. HTML认证页面

#### 注册页面 (`register.html`)
- **前端界面**：现代化的响应式设计，渐变背景和动画效果
- **表单字段**：
  - 用户名输入（至少3个字符）
  - 密码输入（至少6个字符）
  - 确认密码验证
- **验证机制**：
  - 客户端JavaScript实时验证
  - 模拟服务器端验证逻辑
  - 双重验证确保数据安全
- **数据处理**：
  - 客户端验证通过后
  - JavaScript操作localStorage
  - 自动登录并跳转到React应用

#### 登录页面 (`login.html`)
- **前端界面**：与注册页面一致的设计风格
- **表单字段**：
  - 用户名输入
  - 密码输入
- **验证机制**：
  - 客户端JavaScript验证localStorage中的用户数据
  - 实时表单验证反馈
- **调试功能**：
  - "清除所有数据"按钮
  - 便于开发和测试

### 2. React主应用页面

#### 待完成任务页面（首页）
- 显示所有待完成的任务列表
- 支持创建新任务（任务名称、开始时间、结束时间）
- 任务搜索和标签筛选（全部/今日任务/今日截止/已截止）
- 任务排序功能（按开始时间/截止时间）
- 快捷日期选择按钮
- 任务编辑和删除功能
- 一键标记任务完成
- 抽屉式任务编辑界面

#### 已完成任务页面
- 展示所有已完成的任务
- 显示任务完成时间
- 支持搜索和排序功能
- 按完成时间排序

#### 数据统计页面
- 任务总数、完成数、待完成数、逾期数统计
- 任务完成率环形图表（渐变色设计）
- 本周/本月任务趋势折线图
- 数据卡片采用渐变背景和阴影效果
- 统一的颜色体系（已完成=绿色，待完成=橙色，逾期=红色，总数=蓝色）

#### 设置页面
- 主题色自定义（主题色 + 激活色）
- 圆角大小设置
- 实时预览效果
- 表单验证和保存功能

#### 侧边栏功能
- 用户信息显示
- 任务数量徽章（白色背景，主题色文字）
- 主题色渐变选中效果
- 退出登录下拉菜单

## 数据存储

### 本地存储
- 使用浏览器localStorage存储所有数据
- JSON格式数据序列化
- ASP.NET页面和React应用数据完全共享

### 数据模型
```typescript
// 用户模型
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

// 任务模型
interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// 主题配置
interface ThemeConfig {
  primaryColor: string;
  activeColor: string;
  borderRadius: number;
}
```

### 存储键名
- `todo_users`：用户数据
- `todo_current_user`：当前登录用户
- `todo_tasks`：任务数据
- `todo_settings`：应用设置
## 主题系统
