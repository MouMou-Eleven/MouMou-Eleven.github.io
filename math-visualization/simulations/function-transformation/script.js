// 全局变量
let canvas;
let functionType = 'linear';
let aValue = 1;
let hValue = 0;
let kValue = 0;
let bValue = 1;
let showGrid = false;
let showOriginal = true;

// 设置画布大小和比例
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const SCALE = 40; // 每个单位在画布上的像素数

// 坐标系范围
const X_MIN = -10;
const X_MAX = 10;
const Y_MIN = -5;
const Y_MAX = 5;

// 颜色设置
const COLORS = {
    background: '#f5f5f5',
    axis: '#333333',
    grid: '#dddddd',
    original: '#2980b9',
    transformed: '#e74c3c',
};

// p5.js 初始化函数
function setup() {
    // 创建画布并放入指定容器
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('simulation-canvas');
    
    // 设置控件事件监听
    document.getElementById('function-select').addEventListener('change', updateFunction);
    document.getElementById('a-value').addEventListener('input', updateParameters);
    document.getElementById('h-value').addEventListener('input', updateParameters);
    document.getElementById('k-value').addEventListener('input', updateParameters);
    document.getElementById('b-value').addEventListener('input', updateParameters);
    document.getElementById('show-grid').addEventListener('change', updateGrid);
    document.getElementById('show-original').addEventListener('change', updateShowOriginal);
    
    // 初始化显示
    updateParameters();
}

// p5.js 绘制函数，每帧调用
function draw() {
    background(COLORS.background);
    
    // 绘制坐标系
    drawCoordinateSystem();
    
    // 绘制原始函数（如果启用）
    if (showOriginal) {
        drawFunction(false);
    }
    
    // 绘制变换后的函数
    drawFunction(true);
}

// 绘制坐标系
function drawCoordinateSystem() {
    // 转换坐标系，使原点在画布中心
    translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    // 翻转y轴，使正方向向上
    scale(1, -1);
    
    // 绘制网格（如果启用）
    if (showGrid) {
        drawGrid();
    }
    
    // 绘制坐标轴
    stroke(COLORS.axis);
    strokeWeight(2);
    
    // x轴
    line(X_MIN * SCALE, 0, X_MAX * SCALE, 0);
    
    // y轴
    line(0, Y_MIN * SCALE, 0, Y_MAX * SCALE);
    
    // 绘制刻度
    drawTicks();
}

// 绘制网格
function drawGrid() {
    stroke(COLORS.grid);
    strokeWeight(1);
    
    // 竖线（平行于y轴）
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue; // 跳过原点
        line(x * SCALE, Y_MIN * SCALE, x * SCALE, Y_MAX * SCALE);
    }
    
    // 横线（平行于x轴）
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue; // 跳过原点
        line(X_MIN * SCALE, y * SCALE, X_MAX * SCALE, y * SCALE);
    }
}

// 绘制刻度
function drawTicks() {
    const tickSize = 5;
    strokeWeight(1);
    
    // x轴刻度
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue; // 跳过原点
        line(x * SCALE, -tickSize, x * SCALE, tickSize);
        
        // 在原始坐标系下绘制文本
        push();
        scale(1, -1); // 反转y轴回来，以便正确显示文本
        textAlign(CENTER, TOP);
        textSize(10);
        text(x, x * SCALE, tickSize + 2);
        pop();
    }
    
    // y轴刻度
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue; // 跳过原点
        line(-tickSize, y * SCALE, tickSize, y * SCALE);
        
        // 在原始坐标系下绘制文本
        push();
        scale(1, -1); // 反转y轴回来，以便正确显示文本
        textAlign(RIGHT, CENTER);
        textSize(10);
        text(y, -tickSize - 2, -y * SCALE);
        pop();
    }
    
    // 在原点附近绘制0
    push();
    scale(1, -1);
    textAlign(RIGHT, TOP);
    textSize(10);
    text("0", -tickSize - 2, tickSize + 2);
    pop();
}

// 绘制函数
function drawFunction(transformed = false) {
    // 设置线条颜色和粗细
    if (transformed) {
        stroke(COLORS.transformed);
        strokeWeight(3);
    } else {
        stroke(COLORS.original);
        strokeWeight(2);
    }
    
    noFill();
    beginShape();
    
    // 计算函数点并绘制
    const step = 0.1; // 采样步长
    for (let x = X_MIN; x <= X_MAX; x += step) {
        let xValue = x;
        let yValue;
        
        if (transformed) {
            // 应用水平平移和拉伸
            xValue = bValue * (x - hValue);
        }
        
        // 根据函数类型计算y值
        yValue = calculateFunction(xValue, functionType);
        
        if (transformed) {
            // 应用垂直拉伸和平移
            yValue = aValue * yValue + kValue;
        }
        
        // 检查函数值是否在可见范围内
        if (yValue >= Y_MIN && yValue <= Y_MAX) {
            vertex(x * SCALE, yValue * SCALE);
        }
    }
    
    endShape();
}

// 根据函数类型计算函数值
function calculateFunction(x, type) {
    switch(type) {
        case 'linear':
            return x;
        case 'quadratic':
            return x * x;
        case 'cubic':
            return x * x * x;
        case 'sine':
            return Math.sin(x);
        case 'cosine':
            return Math.cos(x);
        case 'exponential':
            // 限制指数函数的范围，防止数值过大
            if (x > 3) return Math.exp(3);
            if (x < -3) return Math.exp(-3);
            return Math.exp(x);
        case 'logarithm':
            // 对数函数只对正数有定义
            if (x <= 0) return NaN;
            return Math.log(x);
        default:
            return 0;
    }
}

// 更新选择的函数类型
function updateFunction() {
    functionType = document.getElementById('function-select').value;
    updateFormulaDisplay();
}

// 更新参数值
function updateParameters() {
    aValue = parseFloat(document.getElementById('a-value').value);
    hValue = parseFloat(document.getElementById('h-value').value);
    kValue = parseFloat(document.getElementById('k-value').value);
    bValue = parseFloat(document.getElementById('b-value').value);
    
    // 更新显示
    document.getElementById('a-display').textContent = aValue;
    document.getElementById('h-display').textContent = hValue;
    document.getElementById('k-display').textContent = kValue;
    document.getElementById('b-display').textContent = bValue;
    
    updateFormulaDisplay();
}

// 更新网格显示设置
function updateGrid() {
    showGrid = document.getElementById('show-grid').checked;
}

// 更新原始函数显示设置
function updateShowOriginal() {
    showOriginal = document.getElementById('show-original').checked;
}

// 更新公式显示
function updateFormulaDisplay() {
    let baseFormula;
    switch(functionType) {
        case 'linear':
            baseFormula = 'x';
            break;
        case 'quadratic':
            baseFormula = 'x²';
            break;
        case 'cubic':
            baseFormula = 'x³';
            break;
        case 'sine':
            baseFormula = 'sin(x)';
            break;
        case 'cosine':
            baseFormula = 'cos(x)';
            break;
        case 'exponential':
            baseFormula = 'e^x';
            break;
        case 'logarithm':
            baseFormula = 'ln(x)';
            break;
    }
    
    // 构建完整的公式表达式
    let formula = `f(x) = ${aValue} · ${baseFormula.replace('x', `(${bValue}(x - ${hValue}))`)} + ${kValue}`;
    document.getElementById('current-formula').textContent = formula;
} 