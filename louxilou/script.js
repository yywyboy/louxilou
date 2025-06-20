// 平滑滚动函数
// 带惯性效果的滚动函数
function smoothScrollTo(targetPosition, duration, velocity = 0) {
    const startPosition = window.pageYOffset;
    let startTime = null;
    let isInertia = velocity !== 0;
    const deceleration = 0.0005; // 惯性衰减系数

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        if (isInertia) {
            // 惯性滚动计算
            velocity -= velocity * deceleration * timeElapsed;
            const delta = velocity * timeElapsed;
            window.scrollTo(0, startPosition + delta);
            
            if (Math.abs(velocity) > 1) {
                requestAnimationFrame(animation);
            }
        } else {
            // 标准缓动滚动
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startPosition + (targetPosition - startPosition) * ease);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
    }

    requestAnimationFrame(animation);
}

// 触摸惯性滚动处理
let touchStartY = 0;
let touchStartTime = 0;
let lastY = 0;
let isScrolling = false;

document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    lastY = touchStartY;
    isScrolling = true;
});

document.addEventListener('touchmove', e => {
    if (!isScrolling) return;
    const deltaY = e.touches[0].clientY - lastY;
    lastY = e.touches[0].clientY;
    window.scrollBy(0, deltaY * -1);
});

document.addEventListener('touchend', e => {
    isScrolling = false;
    const touchEndTime = Date.now();
    const timeDiff = touchEndTime - touchStartTime;
    const velocity = (touchStartY - e.changedTouches[0].clientY) / timeDiff;
    
    if (Math.abs(velocity) > 0.5) {
        smoothScrollTo(0, 0, velocity * 2000);
    }
});

// 动态设置文本宽度
function initTypewriterEffect() {
    const titles = document.querySelectorAll('.标题');
    titles.forEach(title => {
        const textWidth = title.scrollWidth;
        title.style.setProperty('--text-width', `${textWidth}px`);
    });
}

// 添加资源预加载
const preloadImages = () => {
  document.querySelectorAll('[data-preload]').forEach(img => {
    new Image().src = img.dataset.preload;
  });
}

document.addEventListener('DOMContentLoaded', function() {
    initTypewriterEffect();
    // 尝试播放视频以解决自动播放限制
    const video = document.getElementById('bg-video');
    if (video) {
        // 添加视频容器滚轮事件
// 带延迟响应的滚轮事件
video.addEventListener('wheel', function(e) {
    if (e.deltaY > 0) {
        e.preventDefault();
        const contentSection = document.querySelector('.content');
        if (contentSection) {
            // 添加300ms延迟触发滚动
            setTimeout(() => {
                smoothScrollTo(contentSection.offsetTop, 800);
            }, 300);
        }
    }
});

video.play().catch(error => {
            console.log('视频自动播放失败，可能需要用户交互:', error);
        });
        
        // 监听用户交互事件以触发播放
        document.addEventListener('click', function playOnInteraction() {
            if (video.paused) {
                video.play().then(() => {
                    document.removeEventListener('click', playOnInteraction);
                }).catch(err => console.log('用户交互后播放失败:', err));
            }
        });
    }
    fetch('background.json')
        .then(response => response.json())
        .then(data => {
            data.backgrounds.forEach(background => {
                const element = document.getElementById(background.id);
                if (element && background.images && background.images.length > 0) {
                    let currentIndex = -1;
                    
                    function getRandomImage() {
                        if (background.images.length === 1) return background.images[0];
                        let randomIndex;
                        do {
                            randomIndex = Math.floor(Math.random() * background.images.length);
                        } while (randomIndex === currentIndex);
                        currentIndex = randomIndex;
                        return background.images[randomIndex];
                    }
                    
                    function updateBackground() {
                        const imageUrl = getRandomImage();
                        
                        // 预加载图片
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => {
                            element.style.backgroundImage = `url('${imageUrl}')`;
                            element.classList.add('active-bg');
                        };
                        element.style.backgroundPosition = background.position || 'center center';
                        element.style.backgroundSize = background.size || 'cover';
                        element.style.backgroundRepeat = background.repeat || 'no-repeat';
                        if (background.attachment) {
                            element.style.backgroundAttachment = background.attachment;
                        }
                    }
                    
                    // 初始加载随机图片
                    updateBackground();
                    
                    // 每30秒切换一次图片
                    setInterval(updateBackground, 10000);
                } else if (element) {
                    // 兼容旧版配置
                    element.style.backgroundImage = background.imageUrl ? `url('${background.imageUrl}')` : 'none';
                    element.style.backgroundPosition = background.position || 'center center';
                    element.style.backgroundSize = background.size || 'cover';
                    element.style.backgroundRepeat = background.repeat || 'no-repeat';
                    if (background.attachment) {
                        element.style.backgroundAttachment = background.attachment;
                    }
                }
            });
        })
        .catch(error => console.error('Error loading background configurations:', error));
});