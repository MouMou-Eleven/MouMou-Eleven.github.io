// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.main-nav');
    let scrolled = false;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            if (!scrolled) {
                navbar.style.background = '#fff';
                navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                scrolled = true;
            }
        } else {
            if (scrolled) {
                navbar.style.background = '#fff';
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                scrolled = false;
            }
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 模拟实验卡片淡入效果
    const simulationCards = document.querySelectorAll('.simulation-card');
    
    // 检查元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // 添加淡入动画
    function fadeInElements() {
        simulationCards.forEach(card => {
            if (isInViewport(card) && !card.classList.contains('visible')) {
                card.classList.add('visible');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 初始化卡片样式
    simulationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // 页面加载时和滚动时检查
    fadeInElements();
    window.addEventListener('scroll', fadeInElements);
}); 