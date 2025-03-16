/**
 * 数学可视化平台通用JavaScript功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化微信按钮点击事件
    initWechatButton();
    
    // 初始化社交卡片点击事件
    initSocialCards();
    
    // 初始化调试功能
    initDebugMode();
});

/**
 * 初始化微信按钮点击事件
 */
function initWechatButton() {
    const wechatBtn = document.getElementById('wechat-btn');
    if (wechatBtn) {
        wechatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('微信号: math_viz_2025');
        });
    }
}

/**
 * 初始化社交卡片点击事件
 */
function initSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        // 如果卡片没有链接，添加点击样式
        if (!card.getAttribute('href')) {
            card.style.cursor = 'pointer';
            
            // 对于微信卡片，添加点击事件
            if (card.classList.contains('wechat-card')) {
                card.addEventListener('click', function() {
                    alert('微信号: math_viz_2025');
                });
            }
        }
    });
}

/**
 * 初始化调试模式
 */
function initDebugMode() {
    // 检查URL参数是否包含debug=true
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    
    if (debugMode) {
        console.log('调试模式已启用');
        
        // 显示调试信息区域
        const debugElement = document.getElementById('debug-info');
        if (debugElement) {
            debugElement.style.display = 'block';
        }
        
        // 添加页面加载时间
        logDebugInfo('页面加载时间: ' + new Date().toLocaleTimeString());
    } else {
        // 隐藏调试信息区域
        const debugElement = document.getElementById('debug-info');
        if (debugElement) {
            debugElement.style.display = 'none';
        }
    }
}

/**
 * 记录调试信息
 * @param {string} message - 调试信息
 */
function logDebugInfo(message) {
    console.log('[DEBUG] ' + message);
    
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        const logItem = document.createElement('div');
        logItem.textContent = message;
        debugContent.appendChild(logItem);
    }
}

/**
 * 检查元素是否存在
 * @param {string} selector - CSS选择器
 * @returns {boolean} - 元素是否存在
 */
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

/**
 * 添加动态彩虹边框效果
 * @param {string} selector - 要添加效果的元素选择器
 */
function addRainbowBorder(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('rainbow-border');
    });
}

/**
 * 添加毛玻璃效果
 * @param {string} selector - 要添加效果的元素选择器
 */
function addGlassEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('glass-effect');
    });
} 