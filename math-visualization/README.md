# 数学可视化平台

## 项目简介

数学可视化平台是一个交互式学习工具，旨在通过可视化方式帮助学习者直观理解数学概念。平台提供多种数学实验，涵盖几何、代数、微积分等领域，使抽象概念变得生动可见。

## 目录结构

```
math-visualization/
├── css/                    # 样式文件目录
│   ├── clean-theme.css     # 简洁主题基础样式
│   ├── clean-components.css # 简洁组件库
│   └── clean-home.css      # 简洁主页样式
├── js/                     # JavaScript文件目录
│   ├── clean-theme-adapter.js # 主题适配器
│   └── common.js           # 通用JS函数
├── assets/                 # 静态资源目录
│   ├── images/             # 图片
│   └── icons/              # 图标
├── lib/                    # 外部库文件
├── 模拟实验/                # 中文实验演示目录
│   ├── 三角函数/            # 三角函数演示
│   ├── 函数变换/            # 函数变换演示
│   ├── 向量运算/            # 向量运算演示
│   ├── 导数切线/            # 导数切线演示
│   └── 积分计算/            # 积分计算演示
├── index.html              # 主页（原版）
└── index-clean.html        # 简洁版主页
```

## 主题样式

平台提供两套UI主题：

1. **原始主题**：视觉效果丰富，有更多的动画和装饰性元素
2. **简洁主题**：专注于内容展示，减少视觉干扰，提供更清晰的学习体验

### 简洁主题使用方法

在HTML文件中引入以下CSS文件：

```html
<link rel="stylesheet" href="../../css/clean-theme.css">
<link rel="stylesheet" href="../../css/clean-components.css">
```

如需自动将旧组件转换为新组件，可引入适配器：

```html
<script src="../../js/clean-theme-adapter.js"></script>
```

## 实验模块

平台目前提供以下实验模块：

- **三角函数**：通过单位圆和函数图像理解三角函数的定义和性质
- **函数变换**：探索平移、拉伸、反射等函数变换
- **向量运算**：学习向量加减法、点积和叉积等基本运算
- **导数切线**：理解导数的几何意义和应用
- **积分计算**：探索定积分与曲线下面积的关系

## 开发说明

本项目使用纯HTML、CSS和JavaScript开发，无需后端服务器支持，可直接在浏览器中运行。

### 技术栈

- HTML5 / CSS3
- JavaScript (ES6+)
- P5.js (用于图形绘制)
- Math.js (用于数学计算)
- Bootstrap 5 (基础UI组件)

### 贡献指南

如需添加新的实验模块，请参考现有模块的结构，确保：

1. 实验页面引入正确的CSS和JS文件
2. 使用组件库中的组件来保持一致的UI风格
3. 为每个实验提供清晰的说明文档
4. 实现交互式控件，允许用户调整参数
5. 添加适当的可视化反馈

## 联系方式

- 微信：JZNYNandZZZYZ
- 小红书：[哞哞微课设计](https://www.xiaohongshu.com/user/profile/5cff912400000000170007a2)
- 资料：[哞哞微课专属资料](https://hv21wf9uao9.feishu.cn/wiki/R5iYwaKVuicVr0kZ19acC9OwnUb?from=from_copylink) 