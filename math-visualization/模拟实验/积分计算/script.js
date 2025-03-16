// 全局变量
let canvas;
let functionType = 'quadratic';
let lowerBound = -2;
let upperBound = 2;
let numRectangles = 10;
let rectangleType = 'midpoint';
let showTrapezoids = true;
let showExactArea = true;
let animating = false;
let animationProgress = 0;

// 新增：预计算存储
let precalculatedValues = {};

// 全局变量区域添加新变量用于缓存
let cachedFunction = {};
let canvasScale = window.devicePixelRatio || 1;

// 添加一个变量用于跟踪是否需要重绘
let needsRedraw = true;

// 调试函数
function debug(message) {
    console.log(message);
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        debugContent.appendChild(messageElement);
        
        // 自动滚动到底部
        debugContent.scrollTop = debugContent.scrollHeight;
        
        // 限制调试信息数量
        if (debugContent.children.length > 20) {
            debugContent.removeChild(debugContent.children[0]);
        }
    }
}

// 坐标系设置
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const SCALE = 40; // 每个单位在画布上的像素数

// 坐标系范围
const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -5;
const Y_MAX = 5;

// 颜色设置
const COLORS = {
    background: '#f5f5f5',
    axis: '#333333',
    grid: '#dddddd',
    function: '#3498db', // 蓝色
    rectangle: 'rgba(52, 152, 219, 0.5)', // 半透明蓝色
    trapezoid: 'rgba(46, 204, 113, 0.5)', // 半透明绿色
    exactArea: 'rgba(231, 76, 60, 0.3)',  // 半透明红色
    text: '#333333'
};

// 确保DOM加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM内容加载完成，准备初始化...');
    // 延迟执行以确保所有资源加载完成
    setTimeout(initializeSimulation, 500);
});

// 初始化模拟
function initializeSimulation() {
    debug('开始初始化积分模拟...');
    
    // 检查p5.js是否加载
    if (typeof p5 === 'undefined') {
        debug('错误: p5.js库未加载!');
        return;
    }
    
    // 检查容器是否存在
    const container = document.getElementById('simulation-canvas');
    if (!container) {
        debug('错误: 找不到simulation-canvas容器!');
        return;
    }
    
    debug('容器尺寸: ' + container.clientWidth + 'x' + container.clientHeight);
    
    // 创建p5实例
    try {
        new p5(function(p) {
            p.setup = function() {
                debug('p5.js setup函数执行...');
                // 使用像素密度优化高分辨率屏幕显示
                p.pixelDensity(1);
                canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
                canvas.parent('simulation-canvas');
                debug('Canvas创建成功: ' + p.width + 'x' + p.height);
                
                // 预计算常用函数的值
                precalculateValues();
                
                // 设置控件事件监听
                setEventListeners();
                
                // 初始化显示
                updateAreas();
                
                // 设置帧率控制，避免不必要的高频绘制
                p.frameRate(30);
            };
            
            p.draw = function() {
                if (!canvas) {
                    debug('错误: Canvas未初始化!');
                    return;
                }
                
                // 如果没有动画和交互变化，跳过重绘
                if (!animating && p.frameCount > 1 && !needsRedraw) {
                    return;
                }
                
                p.background(COLORS.background);
                
                // 更新动画进度
                if (animating) {
                    animationProgress += 0.01;
                    if (animationProgress >= 1) {
                        animationProgress = 0;
                        
                        // 如果动画完成，增加矩形数量
                        if (numRectangles < 50) {
                            numRectangles += 1;
                            const numRectanglesSlider = document.getElementById('num-rectangles');
                            const numRectanglesDisplay = document.getElementById('num-rectangles-display');
                            
                            if(numRectanglesSlider) numRectanglesSlider.value = numRectangles;
                            if(numRectanglesDisplay) numRectanglesDisplay.textContent = numRectangles;
                            
                            updateAreas();
                        } else {
                            animating = false;
                            const animateBtn = document.getElementById('animate-btn');
                            if(animateBtn) animateBtn.textContent = "动画演示";
                        }
                    }
                    // 动画完成后设置标志
                    needsRedraw = true;
                } else {
                    // 重绘后清除标志
                    needsRedraw = false;
                }
                
                // 设置坐标系中心
                p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                p.scale(1, -1); // 翻转y轴，使正方向向上
                
                // 绘制坐标系和网格
                drawCoordinateSystem(p);
                
                // 绘制函数曲线
                drawFunction(p);
                
                // 绘制积分边界
                drawBounds(p);
                
                // 绘制精确积分区域
                if (showExactArea) {
                    drawExactArea(p);
                }
                
                // 绘制矩形近似
                const currentNumRectangles = animating ? 
                    Math.max(1, Math.floor(numRectangles * animationProgress)) : 
                    numRectangles;
                
                drawRectangles(p, currentNumRectangles);
                
                // 绘制梯形近似
                if (showTrapezoids) {
                    drawTrapezoids(p, currentNumRectangles);
                }
            };
        });
        
        debug('p5.js实例创建成功');
    } catch (error) {
        debug('创建p5实例时出错: ' + error.message);
    }
}

// 优化预计算函数值提高性能
function precalculateValues() {
    debug('预计算函数值...');
    const step = 0.01;
    
    // 清空缓存数据
    precalculatedValues = {};
    
    // 使用Web Worker异步计算（如果浏览器支持）
    if (window.Worker) {
        debug('使用Web Worker进行并行计算...');
        // 这里可以添加Web Worker代码
    } else {
        // 为常用函数预计算值
        const functionTypes = ['quadratic', 'cubic', 'sine', 'linear', 'custom'];
        
        functionTypes.forEach(funcType => {
            precalculatedValues[funcType] = {};
            
            for(let x = X_MIN; x <= X_MAX; x += step) {
                const xRounded = Math.round(x * 100) / 100; // 四舍五入到2位小数
                
                let y;
                switch(funcType) {
                    case 'quadratic':
                        y = xRounded * xRounded;
                        break;
                    case 'cubic':
                        y = xRounded * xRounded * xRounded;
                        break;
                    case 'sine':
                        y = Math.sin(xRounded);
                        break;
                    case 'linear':
                        y = 2 * xRounded + 1;
                        break;
                    case 'custom':
                        y = xRounded * xRounded - 2;
                        break;
                }
                
                precalculatedValues[funcType][xRounded] = y;
            }
        });
    }
    
    debug('预计算完成');
}

// 设置所有事件监听器
function setEventListeners() {
    debug('设置事件监听器...');
    
    // 函数选择
    const functionSelect = document.getElementById('function-select');
    if(functionSelect) {
        functionSelect.addEventListener('change', updateFunction);
        debug('函数选择器监听器已设置');
    } else {
        debug('错误: 找不到函数选择器元素!');
    }
    
    // 积分下限
    const lowerBoundSlider = document.getElementById('lower-bound');
    if(lowerBoundSlider) {
        lowerBoundSlider.addEventListener('input', updateLowerBound);
        debug('下限滑块监听器已设置');
    } else {
        debug('错误: 找不到下限滑块元素!');
    }
    
    // 积分上限
    const upperBoundSlider = document.getElementById('upper-bound');
    if(upperBoundSlider) {
        upperBoundSlider.addEventListener('input', updateUpperBound);
        debug('上限滑块监听器已设置');
    } else {
        debug('错误: 找不到上限滑块元素!');
    }
    
    // 矩形数量
    const numRectanglesSlider = document.getElementById('num-rectangles');
    if(numRectanglesSlider) {
        numRectanglesSlider.addEventListener('input', updateNumRectangles);
        debug('矩形数量滑块监听器已设置');
    } else {
        debug('错误: 找不到矩形数量滑块元素!');
    }
    
    // 矩形类型
    const rectangleTypeSelect = document.getElementById('rectangle-type');
    if(rectangleTypeSelect) {
        rectangleTypeSelect.addEventListener('change', updateRectangleType);
        debug('矩形类型选择器监听器已设置');
    } else {
        debug('错误: 找不到矩形类型选择器元素!');
    }
    
    // 梯形显示设置
    const showTrapezoidsCheckbox = document.getElementById('show-trapezoids');
    if(showTrapezoidsCheckbox) {
        showTrapezoidsCheckbox.addEventListener('change', updateTrapezoidVisibility);
        debug('梯形显示复选框监听器已设置');
    } else {
        debug('错误: 找不到梯形显示复选框元素!');
    }
    
    // 精确面积显示设置
    const showExactAreaCheckbox = document.getElementById('show-exact-area');
    if(showExactAreaCheckbox) {
        showExactAreaCheckbox.addEventListener('change', updateExactAreaVisibility);
        debug('精确面积显示复选框监听器已设置');
    } else {
        debug('错误: 找不到精确面积显示复选框元素!');
    }
    
    // 动画按钮
    const animateBtn = document.getElementById('animate-btn');
    if(animateBtn) {
        animateBtn.addEventListener('click', toggleAnimation);
        debug('动画按钮监听器已设置');
    } else {
        debug('错误: 找不到动画按钮元素!');
    }
    
    debug('所有事件监听器设置完成');
}

// 绘制坐标系
function drawCoordinateSystem(p) {
    // 绘制网格
    p.stroke(COLORS.grid);
    p.strokeWeight(1);
    
    // 垂直网格线
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        p.line(x * SCALE, Y_MIN * SCALE, x * SCALE, Y_MAX * SCALE);
    }
    
    // 水平网格线
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        p.line(X_MIN * SCALE, y * SCALE, X_MAX * SCALE, y * SCALE);
    }
    
    // 绘制坐标轴
    p.stroke(COLORS.axis);
    p.strokeWeight(2);
    
    // x轴
    p.line(X_MIN * SCALE, 0, X_MAX * SCALE, 0);
    
    // y轴
    p.line(0, Y_MIN * SCALE, 0, Y_MAX * SCALE);
    
    // 绘制刻度
    p.strokeWeight(1);
    
    // x轴刻度
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue;
        p.line(x * SCALE, -5, x * SCALE, 5);
    }
    
    // y轴刻度
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue;
        p.line(-5, y * SCALE, 5, y * SCALE);
    }
    
    // 绘制刻度标签
    p.push();
    p.scale(1, -1); // 反转y轴以正确显示文本
    p.fill(COLORS.text);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    
    // x轴标签
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue;
        p.text(x, x * SCALE, 10);
    }
    
    // y轴标签
    p.textAlign(p.RIGHT, p.CENTER);
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue;
        p.text(y, -10, -y * SCALE);
    }
    
    // 原点标签
    p.textAlign(p.RIGHT, p.TOP);
    p.text("O", -10, 10);
    
    p.pop();
}

// 绘制函数
function drawFunction(p) {
    p.stroke(COLORS.function);
    p.strokeWeight(2);
    p.noFill();
    
    // 使用缓存的函数值减少计算
    p.beginShape();
    for(let x = X_MIN; x <= X_MAX; x += 0.05) {
        const xRounded = Math.round(x * 100) / 100;
        const screenX = x * SCALE;
        const y = calculateFunction(xRounded);
        const screenY = y * SCALE;
        
        // 只绘制在可见区域内的点
        if (y >= Y_MIN && y <= Y_MAX) {
            p.vertex(screenX, screenY);
        }
    }
    p.endShape();
}

// 绘制积分上下限
function drawBounds(p) {
    // 绘制下限
    const lowerY = calculateFunction(lowerBound);
    p.stroke(COLORS.axis);
    p.strokeWeight(2);
    p.line(lowerBound * SCALE, 0, lowerBound * SCALE, lowerY * SCALE);
    
    // 绘制上限
    const upperY = calculateFunction(upperBound);
    p.line(upperBound * SCALE, 0, upperBound * SCALE, upperY * SCALE);
    
    // 绘制标签
    p.push();
    p.scale(1, -1); // 反转y轴以正确显示文本
    p.fill(COLORS.axis);
    p.noStroke();
    p.textSize(14);
    
    // 下限标签
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`a = ${lowerBound.toFixed(1)}`, lowerBound * SCALE, -10);
    
    // 上限标签
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`b = ${upperBound.toFixed(1)}`, upperBound * SCALE, -10);
    
    p.pop();
}

// 绘制矩形近似
function drawRectangles(p, currentNumRectangles) {
    const deltaX = (upperBound - lowerBound) / currentNumRectangles;
    
    // 设置填充样式
    p.fill(COLORS.rectangle);
    p.noStroke();
    
    // 绘制每个矩形
    for (let i = 0; i < currentNumRectangles; i++) {
        let x, y;
        
        // 根据选择的矩形类型确定采样点
        if (rectangleType === 'left') {
            x = lowerBound + i * deltaX;
        } else if (rectangleType === 'right') {
            x = lowerBound + (i + 1) * deltaX;
        } else { // midpoint
            x = lowerBound + (i + 0.5) * deltaX;
        }
        
        y = calculateFunction(x);
        
        // 矩形左下角坐标
        const rectX = (lowerBound + i * deltaX) * SCALE;
        const rectY = 0;
        
        // 矩形宽度和高度
        const rectWidth = deltaX * SCALE;
        const rectHeight = y * SCALE;
        
        // 只绘制在可见范围内的矩形
        if (y >= 0) {
            p.rect(rectX, rectY, rectWidth, rectHeight);
        } else {
            p.rect(rectX, rectHeight, rectWidth, -rectHeight);
        }
    }
}

// 绘制梯形近似
function drawTrapezoids(p, currentNumRectangles) {
    const deltaX = (upperBound - lowerBound) / currentNumRectangles;
    
    // 设置填充样式
    p.fill(COLORS.trapezoid);
    p.noStroke();
    
    // 绘制每个梯形
    for (let i = 0; i < currentNumRectangles; i++) {
        const x1 = lowerBound + i * deltaX;
        const x2 = lowerBound + (i + 1) * deltaX;
        const y1 = calculateFunction(x1);
        const y2 = calculateFunction(x2);
        
        // 用顶点绘制梯形
        p.beginShape();
        p.vertex(x1 * SCALE, 0);
        p.vertex(x1 * SCALE, y1 * SCALE);
        p.vertex(x2 * SCALE, y2 * SCALE);
        p.vertex(x2 * SCALE, 0);
        p.endShape(p.CLOSE);
    }
}

// 绘制精确积分区域
function drawExactArea(p) {
    // 设置填充样式
    p.fill(COLORS.exactArea);
    p.noStroke();
    
    // 使用顶点绘制区域
    p.beginShape();
    
    // 首先添加下边界
    p.vertex(lowerBound * SCALE, 0);
    
    // 添加曲线上的点
    for (let x = lowerBound; x <= upperBound; x += 0.05) {
        const y = calculateFunction(x);
        p.vertex(x * SCALE, y * SCALE);
    }
    
    // 添加最后一个点和回到起点
    p.vertex(upperBound * SCALE, calculateFunction(upperBound) * SCALE);
    p.vertex(upperBound * SCALE, 0);
    
    p.endShape(p.CLOSE);
}

// 根据选择的函数类型计算函数值
function calculateFunction(x) {
    // 四舍五入到2位小数以匹配预计算值
    const xRounded = Math.round(x * 100) / 100;
    
    // 尝试使用预计算的值
    if(precalculatedValues[functionType] && 
       precalculatedValues[functionType][xRounded] !== undefined) {
        return precalculatedValues[functionType][xRounded];
    }
    
    // 回退到直接计算
    switch(functionType) {
        case 'quadratic':
            return x * x;
        case 'cubic':
            return x * x * x;
        case 'sine':
            return Math.sin(x);
        case 'linear':
            return 2 * x + 1;
        case 'custom':
            return x * x - 2;
        default:
            return 0;
    }
}

// 计算矩形近似面积
function calculateRectangleArea() {
    const deltaX = (upperBound - lowerBound) / numRectangles;
    let sum = 0;
    
    for (let i = 0; i < numRectangles; i++) {
        let x;
        
        // 根据选择的矩形类型确定采样点
        if (rectangleType === 'left') {
            x = lowerBound + i * deltaX;
        } else if (rectangleType === 'right') {
            x = lowerBound + (i + 1) * deltaX;
        } else { // midpoint
            x = lowerBound + (i + 0.5) * deltaX;
        }
        
        sum += calculateFunction(x);
    }
    
    return sum * deltaX;
}

// 计算梯形近似面积
function calculateTrapezoidArea() {
    const deltaX = (upperBound - lowerBound) / numRectangles;
    let sum = 0.5 * (calculateFunction(lowerBound) + calculateFunction(upperBound));
    
    for (let i = 1; i < numRectangles; i++) {
        const x = lowerBound + i * deltaX;
        sum += calculateFunction(x);
    }
    
    return sum * deltaX;
}

// 计算精确积分值
function calculateExactArea() {
    // 使用解析解或数值积分
    switch(functionType) {
        case 'quadratic': {
            // ∫x² dx = x³/3
            const f1 = (upperBound * upperBound * upperBound) / 3;
            const f0 = (lowerBound * lowerBound * lowerBound) / 3;
            return f1 - f0;
        }
        case 'cubic': {
            // ∫x³ dx = x⁴/4
            const f1 = Math.pow(upperBound, 4) / 4;
            const f0 = Math.pow(lowerBound, 4) / 4;
            return f1 - f0;
        }
        case 'sine': {
            // ∫sin(x) dx = -cos(x)
            return -Math.cos(upperBound) + Math.cos(lowerBound);
        }
        case 'linear': {
            // ∫(2x + 1) dx = x² + x
            const f1 = upperBound * upperBound + upperBound;
            const f0 = lowerBound * lowerBound + lowerBound;
            return f1 - f0;
        }
        case 'custom': {
            // ∫(x² - 2) dx = x³/3 - 2x
            const f1 = upperBound * upperBound * upperBound / 3 - 2 * upperBound;
            const f0 = lowerBound * lowerBound * lowerBound / 3 - 2 * lowerBound;
            return f1 - f0;
        }
        default:
            // 对于没有解析解的函数，使用梯形法的精确度足够高的近似
            const highPrecisionNumRectangles = 1000;
            const deltaX = (upperBound - lowerBound) / highPrecisionNumRectangles;
            let sum = 0.5 * (calculateFunction(lowerBound) + calculateFunction(upperBound));
            
            for (let i = 1; i < highPrecisionNumRectangles; i++) {
                const x = lowerBound + i * deltaX;
                sum += calculateFunction(x);
            }
            
            return sum * deltaX;
    }
}

// 更新选择的函数类型
function updateFunction() {
    functionType = document.getElementById('function-select').value;
    debug('函数类型更新为: ' + functionType);
    updateAreas();
}

// 更新积分下限
function updateLowerBound() {
    lowerBound = parseFloat(document.getElementById('lower-bound').value);
    document.getElementById('lower-bound-display').textContent = lowerBound.toFixed(1);
    
    // 确保下限小于上限
    if (lowerBound >= upperBound) {
        upperBound = lowerBound + 0.1;
        document.getElementById('upper-bound').value = upperBound;
        document.getElementById('upper-bound-display').textContent = upperBound.toFixed(1);
    }
    
    debug('积分下限更新为: ' + lowerBound.toFixed(1));
    updateAreas();
}

// 更新积分上限
function updateUpperBound() {
    upperBound = parseFloat(document.getElementById('upper-bound').value);
    document.getElementById('upper-bound-display').textContent = upperBound.toFixed(1);
    
    // 确保上限大于下限
    if (upperBound <= lowerBound) {
        lowerBound = upperBound - 0.1;
        document.getElementById('lower-bound').value = lowerBound;
        document.getElementById('lower-bound-display').textContent = lowerBound.toFixed(1);
    }
    
    debug('积分上限更新为: ' + upperBound.toFixed(1));
    updateAreas();
}

// 更新矩形数量
function updateNumRectangles() {
    numRectangles = parseInt(document.getElementById('num-rectangles').value);
    document.getElementById('num-rectangles-display').textContent = numRectangles;
    debug('矩形数量更新为: ' + numRectangles);
    updateAreas();
}

// 更新矩形类型
function updateRectangleType() {
    rectangleType = document.getElementById('rectangle-type').value;
    debug('矩形类型更新为: ' + rectangleType);
    updateAreas();
}

// 更新梯形显示设置
function updateTrapezoidVisibility() {
    showTrapezoids = document.getElementById('show-trapezoids').checked;
    debug('梯形显示: ' + (showTrapezoids ? '开启' : '关闭'));
}

// 更新精确面积显示设置
function updateExactAreaVisibility() {
    showExactArea = document.getElementById('show-exact-area').checked;
    debug('精确面积显示: ' + (showExactArea ? '开启' : '关闭'));
}

// 更新面积计算显示
function updateAreas() {
    try {
        const rectangleArea = calculateRectangleArea();
        const trapezoidArea = calculateTrapezoidArea();
        const exactArea = calculateExactArea();
        
        const rectangleAreaElement = document.getElementById('rectangle-area');
        const trapezoidAreaElement = document.getElementById('trapezoid-area');
        const exactAreaElement = document.getElementById('exact-area');
        
        if (rectangleAreaElement) rectangleAreaElement.textContent = rectangleArea.toFixed(4);
        if (trapezoidAreaElement) trapezoidAreaElement.textContent = trapezoidArea.toFixed(4);
        if (exactAreaElement) exactAreaElement.textContent = exactArea.toFixed(4);
        
        debug('面积计算更新完成');
    } catch (error) {
        debug('更新面积计算时出错: ' + error.message);
    }
    
    // 设置需要重绘标志
    needsRedraw = true;
}

// 切换动画
function toggleAnimation() {
    animating = !animating;
    
    if (animating) {
        debug('开始动画演示');
        animationProgress = 0;
        const animateBtn = document.getElementById('animate-btn');
        if (animateBtn) animateBtn.textContent = "停止动画";
        
        // 重置矩形数量为初始值
        numRectangles = 1;
        const numRectanglesSlider = document.getElementById('num-rectangles');
        const numRectanglesDisplay = document.getElementById('num-rectangles-display');
        
        if (numRectanglesSlider) numRectanglesSlider.value = numRectangles;
        if (numRectanglesDisplay) numRectanglesDisplay.textContent = numRectangles;
        
        updateAreas();
    } else {
        debug('停止动画演示');
        const animateBtn = document.getElementById('animate-btn');
        if (animateBtn) animateBtn.textContent = "动画演示";
    }
}

// 在页面内容加载完成后隐藏加载指示器
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(function() {
                loadingIndicator.style.display = 'none';
            }, 500);
        }
    }, 2500); // 等待2.5秒，与动画完成时间一致
}); 