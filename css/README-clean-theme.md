# 数学可视化平台 - 简洁主题指南

这个简洁主题旨在提供一个更干净、更专注于内容的用户界面，减少不必要的视觉干扰，让用户能够更好地关注数学概念和交互功能。

## 文件结构

- `clean-theme.css` - 主要的简洁主题样式，替代原有的通用样式
- `clean-components.css` - 简洁版组件库，替代原有的花哨组件

## 使用方法

### 在HTML文件中引入简洁主题

在每个实验页面的`<head>`部分替换原有的CSS引用：

**原有引用:**
```html
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="../../css/common-experiment.css">
```

**替换为:**
```html
<link rel="stylesheet" href="../../css/clean-theme.css">
<link rel="stylesheet" href="../../css/clean-components.css">
```

### 重构页面组件

使用新的简洁组件替代原有的花哨组件:

#### 1. 使用 `description-card` 替代 `text-card`

**旧版:**
```html
<div class="text-card">
    <div class="status"></div>
    <h3>卡片标题</h3>
    <p>卡片内容...</p>
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

**新版:**
```html
<div class="description-card">
    <span class="indicator"></span>
    <h3>卡片标题</h3>
    <p>卡片内容...</p>
    <div class="meta">最近更新：2025-03-20</div>
    <div class="actions">
        <button class="btn btn-primary">按钮1</button>
        <button class="btn btn-secondary">按钮2</button>
    </div>
</div>
```

#### 2. 使用 `explanation-card` 替代 `blob-card`

**旧版:**
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

**新版:**
```html
<div class="explanation-card">
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

#### 3. 使用 `exploration-card` 替代 `explore-card`

**旧版:**
```html
<div class="explore-card">
    <img src="image.jpg" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">标题</h5>
        <p class="card-text">描述...</p>
        <a href="#" class="btn">按钮</a>
    </div>
</div>
```

**新版:**
```html
<div class="exploration-card">
    <img src="image.jpg" class="card-img" alt="...">
    <div class="card-body">
        <h5 class="card-title">标题</h5>
        <p class="card-text">描述...</p>
        <a href="#" class="btn">按钮</a>
    </div>
</div>
```

#### 4. 使用 `author-panel` 替代原有的作者信息区块

**旧版:**
```html
<div class="author-banner">
    <div class="author-info">
        <h3>作者名称</h3>
        <p>作者描述...</p>
    </div>
    <div class="resource-buttons">
        <a href="#" class="resource-btn">资源1</a>
        <a href="#" class="resource-button">资源2</a>
        <a class="resource-button wechat-btn">微信</a>
    </div>
</div>
```

**新版:**
```html
<div class="author-panel">
    <div class="author-header">
        <img src="../../assets/images/avatar.jpg" alt="作者头像" class="author-avatar">
        <div class="author-info">
            <h3 class="author-name">作者名称</h3>
            <p class="author-role">专业微课设计师</p>
        </div>
    </div>
    <p class="author-description">作者描述...</p>
    <div class="author-links">
        <a href="#" id="wechat-btn" class="author-link"><i class="bi bi-wechat"></i> 微信</a>
        <a href="#" class="author-link"><i class="bi bi-book"></i> 资源</a>
        <a href="#" class="author-link"><i class="bi bi-link-45deg"></i> 小红书主页</a>
    </div>
</div>
```

### 替换作者banner区域

许多页面使用了带有渐变背景的`author-banner`，这是一个比较花哨的设计。使用新的`author-panel`组件替换它：

```html
<!-- 旧的设计 -->
<div class="author-banner">
    <!-- 内容 -->
</div>

<!-- 新的设计 -->
<div class="author-panel">
    <!-- 内容 -->
</div>
```

### 其他值得注意的变化

1. **状态指示器**：使用新的简单状态指示器

   ```html
   <span class="status-indicator success"></span> 成功
   <span class="status-indicator warning"></span> 警告
   <span class="status-indicator danger"></span> 错误
   <span class="status-indicator info"></span> 信息
   ```

2. **数值显示**：使用新的值显示组件

   ```html
   <div class="value-display">
       <div class="value-group">
           <div class="value-label">标签:</div>
           <div class="value">100.00</div>
       </div>
   </div>
   ```

3. **徽章**：使用简洁徽章组件

   ```html
   <span class="badge badge-primary">主要</span>
   <span class="badge badge-success">成功</span>
   <span class="badge badge-warning">警告</span>
   <span class="badge badge-danger">危险</span>
   <span class="badge badge-info">信息</span>
   ```

4. **提示框**：使用简洁提示框

   ```html
   <div class="alert alert-primary">主要提示信息</div>
   <div class="alert alert-success">成功提示信息</div>
   <div class="alert alert-warning">警告提示信息</div>
   <div class="alert alert-danger">错误提示信息</div>
   <div class="alert alert-info">信息提示</div>
   ```

## 实现自动转换

如果您希望保留原有的类名但使用新的样式，可以添加以下兼容性代码到您的页面：

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    // 替换text-card为description-card
    document.querySelectorAll('.text-card').forEach(function(el) {
        el.classList.add('description-card');
    });
    
    // 替换blob-card为explanation-card
    document.querySelectorAll('.blob-card').forEach(function(el) {
        el.classList.add('explanation-card');
    });
    
    // 替换explore-card为exploration-card
    document.querySelectorAll('.explore-card').forEach(function(el) {
        el.classList.add('exploration-card');
    });
});
</script>
```

## 设计原则

新的简洁主题遵循以下设计原则：

1. **内容优先**：减少不必要的装饰元素，让用户更专注于内容
2. **减少动画**：移除过多的动画效果，减少视觉疲劳
3. **适当的留白**：使用合理的间距和留白，让界面更易于阅读
4. **一致性**：保持统一的颜色和样式，提高品牌认知
5. **简洁不简陋**：虽然简化了设计，但保留了必要的视觉层次和结构

## 颜色系统

新主题使用了一个更简洁的颜色系统：

- 主色：`#3366cc`（蓝色）- 用于主要操作和强调
- 次要色：`#6c757d`（灰色）- 用于次要元素
- 背景色：`#ffffff`（白色）和 `#f8f9fa`（浅灰色）
- 文本色：`#333333`（深灰色）和 `#505050`（中灰色）
- 边框色：`#e0e0e0`（浅灰色）

功能色保持不变：
- 成功：`#28a745`
- 信息：`#17a2b8`
- 警告：`#ffc107`
- 危险：`#dc3545` 