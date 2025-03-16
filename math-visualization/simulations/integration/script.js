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

// p5.js 初始化函数
function setup() {
    // 创建画布并放入指定容器
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('simulation-canvas');
    
    // 设置控件事件监听
    document.getElementById('function-select').addEventListener('change', updateFunction);
    document.getElementById('lower-bound').addEventListener('input', updateLowerBound);
    document.getElementById('upper-bound').addEventListener('input', updateUpperBound);
    document.getElementById('num-rectangles').addEventListener('input', updateNumRectangles);
    document.getElementById('rectangle-type').addEventListener('change', updateRectangleType);
    document.getElementById('show-trapezoids').addEventListener('change', updateTrapezoidVisibility);
    document.getElementById('show-exact-area').addEventListener('change', updateExactAreaVisibility);
    document.getElementById('animate-btn').addEventListener('click', toggleAnimation);
    
    // 初始化显示
    updateAreas();
}

// p5.js 绘制函数，每帧调用
function draw() {
    background(COLORS.background);
    
    // 更新动画进度
    if (animating) {
        animationProgress += 0.01;
        if (animationProgress >= 1) {
            animationProgress = 0;
            
            // 如果动画完成，增加矩形数量
            if (numRectangles < 50) {
                numRectangles += 1;
                document.getElementById('num-rectangles').value = numRectangles;
                document.getElementById('num-rectangles-display').textContent = numRectangles;
                updateAreas();
            } else {
                animating = false;
                document.getElementById('animate-btn').textContent = "动画演示";
            }
        }
    }
    
    // 设置坐标系中心
    translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    scale(1, -1); // 翻转y轴，使正方向向上
    
    // 绘制坐标系和网格
    drawCoordinateSystem();
    
    // 绘制精确积分区域
    if (showExactArea) {
        drawExactArea();
    }
    
    // 绘制矩形近似
    const currentNumRectangles = animating ? 
        Math.max(1, Math.floor(numRectangles * animationProgress)) : 
        numRectangles;
    
    drawRectangles(currentNumRectangles);
    
    // 绘制梯形近似
    if (showTrapezoids) {
        drawTrapezoids(currentNumRectangles);
    }
    
    // 绘制函数曲线
    drawFunction();
    
    // 绘制积分上下限
    drawBounds();
}

// 绘制坐标系
function drawCoordinateSystem() {
    // 绘制网格
    stroke(COLORS.grid);
    strokeWeight(1);
    
    // 垂直网格线
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        line(x * SCALE, Y_MIN * SCALE, x * SCALE, Y_MAX * SCALE);
    }
    
    // 水平网格线
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        line(X_MIN * SCALE, y * SCALE, X_MAX * SCALE, y * SCALE);
    }
    
    // 绘制坐标轴
    stroke(COLORS.axis);
    strokeWeight(2);
    
    // x轴
    line(X_MIN * SCALE, 0, X_MAX * SCALE, 0);
    
    // y轴
    line(0, Y_MIN * SCALE, 0, Y_MAX * SCALE);
    
    // 绘制刻度
    strokeWeight(1);
    
    // x轴刻度
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue;
        line(x * SCALE, -5, x * SCALE, 5);
    }
    
    // y轴刻度
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue;
        line(-5, y * SCALE, 5, y * SCALE);
    }
    
    // 绘制刻度标签
    push();
    scale(1, -1); // 反转y轴以正确显示文本
    fill(COLORS.text);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    
    // x轴标签
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue;
        text(x, x * SCALE, 10);
    }
    
    // y轴标签
    textAlign(RIGHT, CENTER);
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue;
        text(y, -10, -y * SCALE);
    }
    
    // 原点标签
    textAlign(RIGHT, TOP);
    text("O", -10, 10);
    
    pop();
}

// 绘制函数
function drawFunction() {
    // 设置线条样式
    stroke(COLORS.function);
    strokeWeight(2);
    noFill();
    
    // 绘制函数曲线
    beginShape();
    for (let px = X_MIN * SCALE; px <= X_MAX * SCALE; px += 2) {
        let x = px / SCALE;
        let y = calculateFunction(x);
        
        // 只在可见范围内绘制
        if (y >= Y_MIN && y <= Y_MAX) {
            vertex(px, y * SCALE);
        }
    }
    endShape();
}

// 绘制积分上下限
function drawBounds() {
    // 绘制下限
    const lowerY = calculateFunction(lowerBound);
    stroke(COLORS.axis);
    strokeWeight(2);
    line(lowerBound * SCALE, 0, lowerBound * SCALE, lowerY * SCALE);
    
    // 绘制上限
    const upperY = calculateFunction(upperBound);
    line(upperBound * SCALE, 0, upperBound * SCALE, upperY * SCALE);
    
    // 绘制标签
    push();
    scale(1, -1); // 反转y轴以正确显示文本
    fill(COLORS.axis);
    noStroke();
    textSize(14);
    
    // 下限标签
    textAlign(CENTER, BOTTOM);
    text(`a = ${lowerBound.toFixed(1)}`, lowerBound * SCALE, -10);
    
    // 上限标签
    textAlign(CENTER, BOTTOM);
    text(`b = ${upperBound.toFixed(1)}`, upperBound * SCALE, -10);
    
    pop();
}

// 绘制矩形近似
function drawRectangles(currentNumRectangles) {
    const deltaX = (upperBound - lowerBound) / currentNumRectangles;
    
    // 设置填充样式
    fill(COLORS.rectangle);
    noStroke();
    
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
            rect(rectX, rectY, rectWidth, rectHeight);
        } else {
            rect(rectX, rectHeight, rectWidth, -rectHeight);
        }
    }
}

// 绘制梯形近似
function drawTrapezoids(currentNumRectangles) {
    const deltaX = (upperBound - lowerBound) / currentNumRectangles;
    
    // 设置填充样式
    fill(COLORS.trapezoid);
    noStroke();
    
    // 绘制每个梯形
    for (let i = 0; i < currentNumRectangles; i++) {
        const x1 = lowerBound + i * deltaX;
        const x2 = lowerBound + (i + 1) * deltaX;
        const y1 = calculateFunction(x1);
        const y2 = calculateFunction(x2);
        
        // 用顶点绘制梯形
        beginShape();
        vertex(x1 * SCALE, 0);
        vertex(x1 * SCALE, y1 * SCALE);
        vertex(x2 * SCALE, y2 * SCALE);
        vertex(x2 * SCALE, 0);
        endShape(CLOSE);
    }
}

// 绘制精确积分区域
function drawExactArea() {
    // 设置填充样式
    fill(COLORS.exactArea);
    noStroke();
    
    // 使用顶点绘制区域
    beginShape();
    
    // 首先添加下边界
    vertex(lowerBound * SCALE, 0);
    
    // 添加曲线上的点
    for (let x = lowerBound; x <= upperBound; x += 0.05) {
        const y = calculateFunction(x);
        vertex(x * SCALE, y * SCALE);
    }
    
    // 添加最后一个点和回到起点
    vertex(upperBound * SCALE, calculateFunction(upperBound) * SCALE);
    vertex(upperBound * SCALE, 0);
    
    endShape(CLOSE);
}

// 根据选择的函数类型计算函数值
function calculateFunction(x) {
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
    
    updateAreas();
}

// 更新矩形数量
function updateNumRectangles() {
    numRectangles = parseInt(document.getElementById('num-rectangles').value);
    document.getElementById('num-rectangles-display').textContent = numRectangles;
    updateAreas();
}

// 更新矩形类型
function updateRectangleType() {
    rectangleType = document.getElementById('rectangle-type').value;
    updateAreas();
}

// 更新梯形显示设置
function updateTrapezoidVisibility() {
    showTrapezoids = document.getElementById('show-trapezoids').checked;
}

// 更新精确面积显示设置
function updateExactAreaVisibility() {
    showExactArea = document.getElementById('show-exact-area').checked;
}

// 更新面积计算显示
function updateAreas() {
    const rectangleArea = calculateRectangleArea();
    const trapezoidArea = calculateTrapezoidArea();
    const exactArea = calculateExactArea();
    
    document.getElementById('rectangle-area').textContent = rectangleArea.toFixed(4);
    document.getElementById('trapezoid-area').textContent = trapezoidArea.toFixed(4);
    document.getElementById('exact-area').textContent = exactArea.toFixed(4);
}

// 切换动画
function toggleAnimation() {
    animating = !animating;
    
    if (animating) {
        animationProgress = 0;
        document.getElementById('animate-btn').textContent = "停止动画";
        
        // 重置矩形数量为初始值
        numRectangles = 1;
        document.getElementById('num-rectangles').value = numRectangles;
        document.getElementById('num-rectangles-display').textContent = numRectangles;
        updateAreas();
    } else {
        document.getElementById('animate-btn').textContent = "动画演示";
    }
} 