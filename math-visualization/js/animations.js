/**
 * 数学可视化平台 - 动画交互效果
 * 为界面添加现代交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('动画交互效果已初始化');
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化微信按钮事件
    initWechatButton();
    
    // 初始化图标动画
    initIconAnimations();
    
    // 初始化卡片交互效果
    initCardInteractions();
    
    // 初始化导航栏动效
    initNavAnimations();
});

/**
 * 初始化滚动显示动画
 * 在元素滚动到视图中时显示它们
 */
function initScrollAnimations() {
    // 为需要滚动显示的元素添加类
    document.querySelectorAll('.feature-item, .experiment-card, h2, .contact-card').forEach(item => {
        if (!item.classList.contains('scroll-reveal')) {
            item.classList.add('scroll-reveal');
        }
    });
    
    // 检查元素是否在视图中
    function checkIfInView() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        const windowHeight = window.innerHeight;
        const triggerPosition = windowHeight * 0.8; // 触发位置为视口高度的80%
        
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerPosition) {
                element.classList.add('revealed');
            }
        });
    }
    
    // 首次加载检查
    setTimeout(checkIfInView, 100);
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', checkIfInView);
}

/**
 * 初始化微信按钮事件
 */
function initWechatButton() {
    const wechatBtn = document.getElementById('wechat-btn');
    if (wechatBtn) {
        wechatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 显示微信ID
            alert('哞哞微课设计的微信号：JZNYNandZZZYZ');
            
            // 添加点击反馈动画
            this.classList.add('shake');
            setTimeout(() => {
                this.classList.remove('shake');
            }, 820);
        });
    }
}

/**
 * 初始化图标动画
 */
function initIconAnimations() {
    // 为特性图标添加悬停动画
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const i = this.querySelector('i');
            if (i) {
                i.classList.add('rotate');
                setTimeout(() => {
                    i.classList.remove('rotate');
                }, 1000);
            }
        });
    });
    
    // 为实验卡片占位符添加交互
    document.querySelectorAll('.experiment-placeholder').forEach(placeholder => {
        placeholder.addEventListener('mouseenter', function() {
            const i = this.querySelector('i');
            if (i) {
                i.classList.add('pulse');
                setTimeout(() => {
                    i.classList.remove('pulse');
                }, 2000);
            }
        });
    });
}

/**
 * 初始化卡片交互效果
 */
function initCardInteractions() {
    // 实验卡片点击跟随效果
    document.querySelectorAll('.experiment-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                const link = this.querySelector('.experiment-button');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // 联系卡片交互
    const contactImage = document.querySelector('.contact-image');
    if (contactImage) {
        contactImage.addEventListener('click', function() {
            this.classList.add('rotate');
            setTimeout(() => {
                this.classList.remove('rotate');
            }, 2000);
        });
    }
}

/**
 * 初始化导航栏动效
 */
function initNavAnimations() {
    // 导航链接点击效果
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // 平滑滚动到目标位置
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
            
            // 活动状态切换
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // 根据滚动位置更新活动导航项
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const sections = ['experiments', 'about', 'contact'];
        
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop - 100;
                const offsetBottom = offsetTop + element.offsetHeight;
                
                if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + section) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 