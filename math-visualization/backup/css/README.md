# 数学可视化平台 - CSS组件库

本目录包含数学可视化平台的通用CSS组件和样式，用于确保所有实验页面具有一致的外观和用户体验。

## 文件结构

- `components.css` - 包含可重用的UI组件样式
- `common-experiment.css` - 包含所有实验页面共享的基础样式

## 组件库使用指南

### 引入方式

在HTML文件的`<head>`部分添加以下代码：

```html
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="../../css/common-experiment.css">
```

### 可用组件

#### 1. 动态彩虹边框 (Rainbow Border)

为元素添加动态彩虹边框效果。

```html
<div class="rainbow-border">
    <!-- 内容 -->
</div>
```

#### 2. 文本卡片 (Text Card)

用于展示文本内容的卡片，带有状态指示器、链接和按钮。

```html
<div class="text-card">
    <div class="status"></div>
    <h3>卡片标题</h3>
    <p>卡片内容描述...</p>
    <div class="card-links">
        <a href="#link1">链接1</a>
        <a href="#link2">链接2</a>
    </div>
    <div class="card-buttons">
        <button>按钮1</button>
        <button>按钮2</button>
    </div>
</div>
```

#### 3. 气泡卡片 (Blob Card)

带有动态背景效果的卡片，适合用于解释性内容。

```html
<div class="blob-card">
    <h2>主标题</h2>
    <p>内容描述...</p>
    <h3>子标题</h3>
    <ul>
        <li>列表项1</li>
        <li>列表项2</li>
    </ul>
    <a href="#more">了解更多</a>
</div>
```

#### 4. 毛玻璃效果 (Glass Effect)

为元素添加毛玻璃效果。

```html
<div class="glass-effect">
    <!-- 内容 -->
</div>
```

## 通用页面结构

所有实验页面应遵循以下基本结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>实验名称 - 数学动画演示</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../css/components.css">
    <link rel="stylesheet" href="../../css/common-experiment.css">
    <link rel="stylesheet" href="style.css">
    <!-- 其他特定页面的CSS和JS -->
</head>
<body>
    <!-- 页面头部 -->
    <header class="page-header">
        <div class="container">
            <h1><i class="bi bi-graph-up"></i> 实验名称</h1>
        </div>
    </header>

    <!-- 作者信息 -->
    <div class="container">
        <div class="author-info">
            <div class="author">
                <img src="../../assets/images/avatar.jpg" alt="作者头像">
                <div>
                    <div class="name">作者名称</div>
                    <div class="date">更新日期: 2025-03-16</div>
                </div>
            </div>
            <div class="social-links">
                <a href="#" id="wechat-btn">微信</a>
                <a href="https://www.xiaohongshu.com/user/profile/12345" target="_blank">小红书</a>
                <a href="#resources">资料</a>
            </div>
        </div>

        <!-- 标签页导航 -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab1" role="tab">标签1</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="tab2-tab" data-bs-toggle="tab" href="#tab2" role="tab">标签2</a>
            </li>
        </ul>

        <!-- 标签页内容 -->
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="tab1" role="tabpanel">
                <!-- 标签1内容 -->
            </div>
            <div class="tab-pane fade" id="tab2" role="tabpanel">
                <!-- 标签2内容 -->
            </div>
        </div>

        <!-- 页脚 -->
        <footer class="footer">
            <p>© 2025 数学动画演示平台 | 版权所有</p>
        </footer>
    </div>

    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

## 响应式设计

所有组件和页面布局都已针对不同屏幕尺寸进行了优化。使用Bootstrap的栅格系统可以轻松创建响应式布局：

```html
<div class="row">
    <div class="col-12 col-md-6">
        <!-- 在小屏幕上占满宽度，在中等屏幕上占一半宽度 -->
    </div>
    <div class="col-12 col-md-6">
        <!-- 在小屏幕上占满宽度，在中等屏幕上占一半宽度 -->
    </div>
</div>
```

## 无障碍支持

组件库包含针对无障碍性的优化，如减少动画（对于用户选择减少动画的情况）和适当的颜色对比度。

## 通用JavaScript功能

项目包含一个通用JavaScript文件 `js/common.js`，提供所有页面共享的功能：

### 引入方式

在HTML文件的底部添加以下代码：

```html
<script src="../../js/common.js"></script>
```

### 可用功能

1. **微信按钮点击事件**：自动为ID为 `wechat-btn` 的元素添加点击事件，显示微信号。

2. **社交卡片点击事件**：为类名包含 `social-card` 的元素添加点击样式和事件。

3. **调试模式**：通过URL参数 `?debug=true` 启用调试模式，显示调试信息。

4. **辅助函数**：
   - `elementExists(selector)` - 检查元素是否存在
   - `addRainbowBorder(selector)` - 为元素添加动态彩虹边框效果
   - `addGlassEffect(selector)` - 为元素添加毛玻璃效果
   - `logDebugInfo(message)` - 记录调试信息

### 使用示例

```javascript
// 检查元素是否存在
if (elementExists('#myElement')) {
    // 元素存在，执行操作
}

// 添加动态彩虹边框
addRainbowBorder('.highlight-box');

// 添加毛玻璃效果
addGlassEffect('.overlay-panel');

// 记录调试信息（仅在调试模式下显示）
logDebugInfo('初始化完成');
``` 