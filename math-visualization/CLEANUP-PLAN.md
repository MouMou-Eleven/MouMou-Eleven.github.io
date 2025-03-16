# 数学可视化平台 - 文件清理计划

根据对项目结构的分析，以下是建议的文件清理计划。此计划旨在保留必要的功能文件，同时删除冗余或过时的文件，使项目结构更加清晰。

## 需要保留的文件和目录

### 核心文件
- `index-clean.html` - 新的简洁版主页
- `README.md` - 项目文档

### CSS 目录
- `css/clean-theme.css` - 简洁主题基础样式
- `css/clean-components.css` - 简洁组件库
- `css/clean-home.css` - 简洁主页样式
- `css/README-clean-theme.md` - 简洁主题使用文档

### JavaScript 目录
- `js/clean-theme-adapter.js` - 主题适配器
- `js/common.js` - 通用JavaScript函数

### 实验目录
- `模拟实验/` - 所有中文实验模块
  - `三角函数/`
  - `函数变换/`
  - `向量运算/`
  - `导数切线/`
  - `概率统计/`
  - `积分计算/`

### 资源目录
- `assets/` - 图片、图标等静态资源
- `lib/` - 第三方库文件

## 可以删除的文件和目录

### 冗余文件
- `index.html` - 旧版主页（可以用 index-clean.html 替代并重命名）
- `simulations/` - 英文版实验目录（与模拟实验目录功能重复）

### CSS 目录中的旧文件
- `css/components.css` - 旧的组件样式
- `css/common-experiment.css` - 旧的实验页面通用样式
- `css/style.css` - 通用样式，已被 clean-theme.css 替代
- `css/README.md` - 旧的样式文档，已被 README-clean-theme.md 替代

### 其他可能不需要的文件
- `js/bootstrap.bundle.min.js` - 如果已通过CDN引入
- `css/bootstrap.min.css` - 如果已通过CDN引入

## 清理步骤

1. **备份**：在删除任何文件前，先进行完整的项目备份
2. **测试简洁版**：确认 index-clean.html 的所有功能正常
3. **重命名**：将 index-clean.html 重命名为 index.html（替换旧版首页）
4. **移除冗余目录**：删除 simulations/ 目录
5. **移除旧样式**：删除不再需要的CSS文件
6. **清理未使用的JavaScript**：删除未被引用的JS文件
7. **更新引用**：确保所有HTML文件都引用了正确的CSS和JS文件
8. **最终测试**：清理后进行全面测试，确保所有功能正常

## 注意事项

- 删除文件前，请确认这些文件确实不再被任何地方引用
- 如果某些旧文件仍然被使用，可以先保留并逐步迁移到新的样式系统
- 考虑将所有实验页面更新为使用新的样式系统，以保持一致性 