/**
 * 数学可视化平台 - 简洁主题适配器
 * 
 * 这个脚本可以自动将页面中的旧组件转换为新的简洁组件
 * 无需修改HTML代码，只需引入此脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Clean Theme Adapter: 初始化');
    
    // 转换 text-card 为 description-card
    convertTextCards();
    
    // 转换 blob-card 为 explanation-card
    convertBlobCards();
    
    // 转换 explore-card 为 exploration-card
    convertExploreCards();
    
    // 转换 author-banner 为 author-panel
    convertAuthorBanners();
    
    // 移除所有动画效果
    removeAnimations();
    
    console.log('Clean Theme Adapter: 转换完成');
});

/**
 * 将text-card转换为description-card
 */
function convertTextCards() {
    document.querySelectorAll('.text-card').forEach(function(card) {
        console.log('转换 text-card');
        
        // 添加新样式类
        card.classList.add('description-card');
        
        // 找到并转换内部元素
        const status = card.querySelector('.status');
        if (status) {
            status.classList.add('indicator');
        }
        
        const cardLinks = card.querySelector('.card-links');
        if (cardLinks) {
            cardLinks.classList.add('meta');
        }
        
        const cardButtons = card.querySelector('.card-buttons');
        if (cardButtons) {
            cardButtons.classList.add('actions');
            
            // 转换按钮
            const primaryBtn = cardButtons.querySelector('.primary-btn');
            if (primaryBtn) {
                primaryBtn.classList.add('btn', 'btn-primary');
            }
            
            const secondaryBtn = cardButtons.querySelector('.secondary-btn');
            if (secondaryBtn) {
                secondaryBtn.classList.add('btn', 'btn-secondary');
            }
        }
    });
}

/**
 * 将blob-card转换为explanation-card
 */
function convertBlobCards() {
    document.querySelectorAll('.blob-card').forEach(function(card) {
        console.log('转换 blob-card');
        
        // 添加新样式类
        card.classList.add('explanation-card');
        
        // 移除动画背景
        const blob = card.querySelector('.blob');
        if (blob) {
            blob.style.display = 'none';
        }
        
        const bg = card.querySelector('.bg');
        if (bg) {
            bg.style.display = 'none';
        }
        
        // 如果内容被包装在card-content中，提取出来
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
            // 将card-content的子元素移动到card本身
            while (cardContent.firstChild) {
                card.appendChild(cardContent.firstChild);
            }
            card.removeChild(cardContent);
        }
    });
}

/**
 * 将explore-card转换为exploration-card
 */
function convertExploreCards() {
    document.querySelectorAll('.explore-card').forEach(function(card) {
        console.log('转换 explore-card');
        
        // 添加新样式类
        card.classList.add('exploration-card');
        
        // 转换图片类名
        const img = card.querySelector('.card-img-top');
        if (img) {
            img.classList.add('card-img');
        }
        
        // 转换按钮
        const btn = card.querySelector('.btn');
        if (btn && !btn.classList.contains('btn-primary')) {
            btn.classList.add('btn-primary');
        }
    });
}

/**
 * 将author-banner转换为author-panel
 */
function convertAuthorBanners() {
    document.querySelectorAll('.author-banner').forEach(function(banner) {
        console.log('转换 author-banner');
        
        // 创建新的author-panel
        const panel = document.createElement('div');
        panel.className = 'author-panel';
        
        // 创建header
        const header = document.createElement('div');
        header.className = 'author-header';
        
        // 查找作者信息
        const authorInfo = banner.querySelector('.author-info');
        if (authorInfo) {
            // 提取作者名称和描述
            const authorName = authorInfo.querySelector('h3');
            const authorDescriptions = authorInfo.querySelectorAll('p');
            
            // 创建avatar容器（假设没有真实头像）
            const avatar = document.createElement('div');
            avatar.className = 'author-avatar';
            avatar.style.backgroundColor = '#e0e0e0';
            
            // 创建info容器
            const info = document.createElement('div');
            info.className = 'author-info';
            
            // 添加作者名称
            if (authorName) {
                const name = document.createElement('h3');
                name.className = 'author-name';
                name.textContent = authorName.textContent;
                info.appendChild(name);
            }
            
            // 添加角色描述（使用第一个p标签）
            if (authorDescriptions.length > 0) {
                const role = document.createElement('p');
                role.className = 'author-role';
                role.textContent = authorDescriptions[0].textContent;
                info.appendChild(role);
            }
            
            // 添加到header
            header.appendChild(avatar);
            header.appendChild(info);
            panel.appendChild(header);
            
            // 添加描述（使用剩余的p标签）
            if (authorDescriptions.length > 1) {
                const description = document.createElement('p');
                description.className = 'author-description';
                const descText = Array.from(authorDescriptions)
                    .slice(1)
                    .map(p => p.textContent)
                    .join(' ');
                description.textContent = descText;
                panel.appendChild(description);
            }
        }
        
        // 处理资源按钮
        const resourceButtons = banner.querySelector('.resource-buttons');
        if (resourceButtons) {
            const links = document.createElement('div');
            links.className = 'author-links';
            
            // 转换所有资源按钮
            const buttons = resourceButtons.querySelectorAll('a');
            buttons.forEach(function(btn) {
                const link = document.createElement('a');
                link.className = 'author-link';
                link.href = btn.href || '#';
                
                // 保留ID
                if (btn.id) {
                    link.id = btn.id;
                }
                
                // 尝试找到图标
                const icon = btn.querySelector('i');
                if (icon) {
                    const newIcon = document.createElement('i');
                    newIcon.className = icon.className;
                    link.appendChild(newIcon);
                }
                
                // 提取文本
                let text = btn.textContent.trim();
                if (icon) {
                    text = text.replace(icon.textContent, '').trim();
                }
                link.appendChild(document.createTextNode(text));
                
                links.appendChild(link);
            });
            
            panel.appendChild(links);
        }
        
        // 替换原有banner
        banner.parentNode.insertBefore(panel, banner);
        banner.parentNode.removeChild(banner);
    });
}

/**
 * 移除所有动画效果
 */
function removeAnimations() {
    // 移除rainbow-border动画
    document.querySelectorAll('.rainbow-border').forEach(function(el) {
        el.classList.add('description-card');
    });
    
    // 移除dynamic-border动画
    document.querySelectorAll('.dynamic-border').forEach(function(el) {
        el.style.animation = 'none';
        el.classList.add('panel');
    });
    
    // 禁用所有动画效果
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
} 