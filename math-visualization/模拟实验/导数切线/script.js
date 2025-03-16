// 全局变量
let canvas;
let functionType = 'quadratic';
let xValue = 1;
let hValue = 1;
let animationSpeed = 0;
let animationDirection = 1;
let showTangent = true;
let showSecant = false;
let showDerivative = false;
let showLabels = true;

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
    background: 'white',
    axis: '#333333',
    grid: '#dddddd',
    function: '#3498db', // 蓝色
    tangent: '#e74c3c',  // 红色
    secant: '#2ecc71',   // 绿色
    derivative: '#9b59b6', // 紫色
    point: '#f39c12',    // 橙色
    text: '#333333'
};

// p5.js 初始化函数
function setup() {
    // 创建画布并放入指定容器
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('simulation-canvas');
    
    // 设置控件事件监听
    document.getElementById('function-select').addEventListener('change', updateFunction);
    document.getElementById('x-value').addEventListener('input', updateXValue);
    document.getElementById('animation-speed').addEventListener('input', updateAnimationSpeed);
    document.getElementById('show-tangent').addEventListener('change', updateTangentVisibility);
    document.getElementById('show-secant').addEventListener('change', updateSecantVisibility);
    document.getElementById('show-derivative').addEventListener('change', updateDerivativeVisibility);
    document.getElementById('show-labels').addEventListener('change', updateLabelsVisibility);
    document.getElementById('h-value').addEventListener('input', updateHValue);
    
    // 初始化显示
    updateFunctionInfo();
    updateSecantControlsVisibility();
}

// p5.js 绘制函数，每帧调用
function draw() {
    background(COLORS.background);
    
    // 如果有动画速度，更新x值
    if (animationSpeed > 0) {
        xValue += animationSpeed * 0.02 * animationDirection;
        
        // 当x值到达边界时反向
        if (xValue > X_MAX - 0.5) {
            animationDirection = -1;
        } else if (xValue < X_MIN + 0.5) {
            animationDirection = 1;
        }
        
        // 更新滑块和显示
        document.getElementById('x-value').value = xValue;
        document.getElementById('x-display').textContent = xValue.toFixed(1);
        updateFunctionInfo();
    }
    
    // 设置坐标系中心
    translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    scale(1, -1); // 翻转y轴，使正方向向上
    
    // 绘制坐标系和网格
    drawCoordinateSystem();
    
    // 绘制导函数
    if (showDerivative) {
        drawDerivativeFunction();
    }
    
    // 绘制原函数
    drawFunction();
    
    // 绘制切线
    if (showTangent) {
        drawTangentLine();
    }
    
    // 绘制割线
    if (showSecant) {
        drawSecantLine();
    }
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
    if (showLabels) {
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
    
    // 绘制函数上的点
    const y = calculateFunction(xValue);
    
    // 绘制点
    fill(COLORS.point);
    noStroke();
    circle(xValue * SCALE, y * SCALE, 8);
    
    // 绘制点的坐标标签
    if (showLabels) {
        push();
        scale(1, -1); // 反转y轴以正确显示文本
        fill(COLORS.point);
        noStroke();
        textSize(12);
        textAlign(LEFT, CENTER);
        text(`(${xValue.toFixed(1)}, ${y.toFixed(2)})`, xValue * SCALE + 10, -y * SCALE);
        pop();
    }
}

// 绘制切线
function drawTangentLine() {
    const x0 = xValue;
    const y0 = calculateFunction(x0);
    const slope = calculateDerivative(x0);
    
    // 计算切线上的两点用于绘制
    const x1 = X_MIN;
    const y1 = slope * (x1 - x0) + y0;
    const x2 = X_MAX;
    const y2 = slope * (x2 - x0) + y0;
    
    // 绘制切线
    stroke(COLORS.tangent);
    strokeWeight(2);
    line(x1 * SCALE, y1 * SCALE, x2 * SCALE, y2 * SCALE);
    
    // 绘制切线方程标签
    if (showLabels) {
        push();
        scale(1, -1); // 反转y轴以正确显示文本
        fill(COLORS.tangent);
        noStroke();
        textSize(12);
        textAlign(LEFT, BOTTOM);
        
        // 找一个合适的标签位置
        let labelX = x0 + 1;
        let labelY = slope * (labelX - x0) + y0;
        
        // 确保标签在可见范围内
        if (labelX > X_MAX - 1) {
            labelX = x0 - 1;
            labelY = slope * (labelX - x0) + y0;
        }
        
        text(`切线: y = ${slope.toFixed(2)}x + ${(y0 - slope * x0).toFixed(2)}`, labelX * SCALE + 5, -labelY * SCALE - 5);
        pop();
    }
}

// 绘制割线
function drawSecantLine() {
    const x0 = xValue;
    const y0 = calculateFunction(x0);
    const x1 = x0 + hValue;
    const y1 = calculateFunction(x1);
    
    // 计算割线斜率
    const secantSlope = (y1 - y0) / (x1 - x0);
    
    // 计算割线的两个端点用于绘制
    const secantX1 = X_MIN;
    const secantY1 = secantSlope * (secantX1 - x0) + y0;
    const secantX2 = X_MAX;
    const secantY2 = secantSlope * (secantX2 - x0) + y0;
    
    // 绘制割线
    stroke(COLORS.secant);
    strokeWeight(2);
    line(secantX1 * SCALE, secantY1 * SCALE, secantX2 * SCALE, secantY2 * SCALE);
    
    // 绘制第二个点
    fill(COLORS.secant);
    noStroke();
    circle(x1 * SCALE, y1 * SCALE, 8);
    
    // 绘制标签
    if (showLabels) {
        push();
        scale(1, -1); // 反转y轴以正确显示文本
        
        // 第二个点的坐标
        fill(COLORS.secant);
        noStroke();
        textSize(12);
        textAlign(LEFT, CENTER);
        text(`(${x1.toFixed(1)}, ${y1.toFixed(2)})`, x1 * SCALE + 10, -y1 * SCALE);
        
        // 割线斜率
        textAlign(LEFT, BOTTOM);
        text(`割线斜率: ${secantSlope.toFixed(2)}`, (x0 + x1) / 2 * SCALE, -(y0 + y1) / 2 * SCALE - 10);
        
        pop();
    }
}

// 绘制导函数
function drawDerivativeFunction() {
    // 设置线条样式
    stroke(COLORS.derivative);
    strokeWeight(2);
    noFill();
    
    // 绘制导函数曲线
    beginShape();
    for (let px = X_MIN * SCALE; px <= X_MAX * SCALE; px += 2) {
        let x = px / SCALE;
        let y = calculateDerivative(x);
        
        // 只在可见范围内绘制
        if (y >= Y_MIN && y <= Y_MAX) {
            vertex(px, y * SCALE);
        }
    }
    endShape();
    
    // 绘制导函数上的点
    const derivativeY = calculateDerivative(xValue);
    
    // 绘制点
    fill(COLORS.derivative);
    noStroke();
    circle(xValue * SCALE, derivativeY * SCALE, 8);
    
    // 绘制导函数标签
    if (showLabels) {
        push();
        scale(1, -1); // 反转y轴以正确显示文本
        
        fill(COLORS.derivative);
        noStroke();
        textSize(12);
        textAlign(LEFT, TOP);
        
        // 点的坐标
        text(`f'(${xValue.toFixed(1)}) = ${derivativeY.toFixed(2)}`, xValue * SCALE + 10, -derivativeY * SCALE + 10);
        
        // 导函数表达式
        textAlign(RIGHT, BOTTOM);
        text(`f'(x) = ${getDerivativeExpression()}`, (X_MAX - 0.5) * SCALE, -(Y_MIN + 0.5) * SCALE);
        
        pop();
    }
}

// 计算函数值
function calculateFunction(x) {
    switch (functionType) {
        case 'quadratic':
            return x * x;
        case 'cubic':
            return x * x * x;
        case 'sine':
            return Math.sin(x);
        case 'logarithm':
            return x > 0 ? Math.log(x) : NaN;
        case 'exponential':
            return Math.exp(x);
        case 'custom':
            return x * x - 2 * x + 1; // 自定义函数: x² - 2x + 1
        default:
            return 0;
    }
}

// 计算导数值
function calculateDerivative(x) {
    switch (functionType) {
        case 'quadratic':
            return 2 * x;
        case 'cubic':
            return 3 * x * x;
        case 'sine':
            return Math.cos(x);
        case 'logarithm':
            return x > 0 ? 1 / x : NaN;
        case 'exponential':
            return Math.exp(x);
        case 'custom':
            return 2 * x - 2; // 自定义函数导数: 2x - 2
        default:
            return 0;
    }
}

// 获取函数表达式字符串
function getFunctionExpression() {
    switch (functionType) {
        case 'quadratic':
            return 'x²';
        case 'cubic':
            return 'x³';
        case 'sine':
            return 'sin(x)';
        case 'logarithm':
            return 'ln(x)';
        case 'exponential':
            return 'e^x';
        case 'custom':
            return 'x² - 2x + 1';
        default:
            return '';
    }
}

// 获取导函数表达式字符串
function getDerivativeExpression() {
    switch (functionType) {
        case 'quadratic':
            return '2x';
        case 'cubic':
            return '3x²';
        case 'sine':
            return 'cos(x)';
        case 'logarithm':
            return '1/x';
        case 'exponential':
            return 'e^x';
        case 'custom':
            return '2x - 2';
        default:
            return '';
    }
}

// 更新选择的函数
function updateFunction() {
    functionType = document.getElementById('function-select').value;
    updateFunctionInfo();
}

// 更新x值
function updateXValue() {
    xValue = parseFloat(document.getElementById('x-value').value);
    document.getElementById('x-display').textContent = xValue.toFixed(1);
    updateFunctionInfo();
}

// 更新h值（割线）
function updateHValue() {
    hValue = parseFloat(document.getElementById('h-value').value);
    document.getElementById('h-display').textContent = hValue.toFixed(1);
}

// 更新动画速度
function updateAnimationSpeed() {
    animationSpeed = parseFloat(document.getElementById('animation-speed').value);
    document.getElementById('speed-display').textContent = animationSpeed.toFixed(1);
    
    // 更新动画按钮状态
    updateAnimationButtonsState();
}

// 更新动画按钮状态
function updateAnimationButtonsState() {
    const startBtn = document.getElementById('start-animation-btn');
    const stopBtn = document.getElementById('stop-animation-btn');
    
    if (animationSpeed > 0) {
        // 动画运行中，显示暂停按钮，隐藏启动按钮
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';
    } else {
        // 动画已暂停，显示启动按钮，隐藏暂停按钮
        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
    }
}

// 在页面加载完成时初始化按钮状态
document.addEventListener('DOMContentLoaded', function() {
    // 初始化动画按钮状态
    updateAnimationButtonsState();
});

// 更新切线可见性
function updateTangentVisibility() {
    showTangent = document.getElementById('show-tangent').checked;
}

// 更新割线可见性
function updateSecantVisibility() {
    showSecant = document.getElementById('show-secant').checked;
    updateSecantControlsVisibility();
}

// 更新导函数可见性
function updateDerivativeVisibility() {
    showDerivative = document.getElementById('show-derivative').checked;
}

// 更新标签可见性
function updateLabelsVisibility() {
    showLabels = document.getElementById('show-labels').checked;
}

// 更新割线控件可见性
function updateSecantControlsVisibility() {
    const secantControls = document.getElementById('secant-controls');
    secantControls.style.display = showSecant ? 'block' : 'none';
}

// 更新函数信息显示
function updateFunctionInfo() {
    const functionValue = calculateFunction(xValue);
    const derivativeValue = calculateDerivative(xValue);
    
    // 显示函数值
    document.getElementById('function-value').textContent = isNaN(functionValue) ? '未定义' : functionValue.toFixed(3);
    
    // 显示导数值
    document.getElementById('derivative-value').textContent = isNaN(derivativeValue) ? '未定义' : derivativeValue.toFixed(3);
    
    // 更新切线方程
    if (!isNaN(functionValue) && !isNaN(derivativeValue)) {
        const b = functionValue - derivativeValue * xValue;
        const sign = b >= 0 ? '+' : '';
        document.getElementById('tangent-equation').textContent = `y = ${derivativeValue.toFixed(2)}x ${sign} ${b.toFixed(2)}`;
    } else {
        document.getElementById('tangent-equation').textContent = '未定义';
    }
} 