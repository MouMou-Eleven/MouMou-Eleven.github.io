// 全局变量
let canvas;
let angle = 45; // 初始角度（度）
let speed = 0; // 旋转速度
let showSin = true;
let showCos = true;
let showTan = false;
let showGraph = true;
let showLabels = true;

// 单位圆设置
const CIRCLE_RADIUS = 120; // 单位圆半径（像素）
const GRAPH_WIDTH = 400; // 函数图像宽度
const GRAPH_HEIGHT = 120; // 函数图像高度

// 颜色设置
const COLORS = {
    background: '#f5f5f5',
    circle: '#dddddd',
    axis: '#333333',
    angle: '#666666',
    sin: '#e74c3c', // 红色
    cos: '#3498db', // 蓝色
    tan: '#2ecc71', // 绿色
    point: '#9b59b6', // 紫色
    grid: '#eeeeee',
    text: '#333333'
};

// p5.js 初始化函数
function setup() {
    // 创建画布并放入指定容器
    canvas = createCanvas(800, 500);
    canvas.parent('simulation-canvas');
    
    // 设置控件事件监听
    document.getElementById('angle-slider').addEventListener('input', updateAngle);
    document.getElementById('speed-slider').addEventListener('input', updateSpeed);
    document.getElementById('show-sin').addEventListener('change', updateSinVisibility);
    document.getElementById('show-cos').addEventListener('change', updateCosVisibility);
    document.getElementById('show-tan').addEventListener('change', updateTanVisibility);
    document.getElementById('show-graph').addEventListener('change', updateGraphVisibility);
    document.getElementById('show-labels').addEventListener('change', updateLabelsVisibility);
    
    // 初始化显示
    updateTrigValues();
}

// p5.js 绘制函数，每帧调用
function draw() {
    background(COLORS.background);
    
    // 如果有旋转速度，更新角度
    if (speed > 0) {
        angle = (angle + speed) % 360;
        document.getElementById('angle-slider').value = angle;
        document.getElementById('angle-display').textContent = Math.round(angle) + '°';
        updateTrigValues();
    }
    
    // 计算角度的弧度值
    const radians = angle * Math.PI / 180;
    
    // 计算三角函数值
    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    let tanValue = Math.tan(radians);
    
    // 设置坐标系中心
    translate(200, 200);
    
    // 绘制单位圆和坐标轴
    drawCoordinateSystem();
    
    // 绘制单位圆上的点和角度
    drawAngle(radians, cosValue, sinValue);
    
    // 绘制正弦、余弦和正切线
    if (showSin) drawSin(sinValue);
    if (showCos) drawCos(cosValue);
    if (showTan) drawTan(tanValue, cosValue);
    
    // 绘制函数图像
    if (showGraph) {
        translate(-200, 250);
        drawGraph(radians);
    }
}

// 绘制坐标系
function drawCoordinateSystem() {
    // 绘制单位圆
    noFill();
    stroke(COLORS.circle);
    strokeWeight(1);
    circle(0, 0, CIRCLE_RADIUS * 2);
    
    // 绘制坐标轴
    stroke(COLORS.axis);
    strokeWeight(2);
    
    // x轴
    line(-CIRCLE_RADIUS - 30, 0, CIRCLE_RADIUS + 30, 0);
    // y轴
    line(0, -CIRCLE_RADIUS - 30, 0, CIRCLE_RADIUS + 30);
    
    // 绘制坐标轴箭头
    drawArrow(CIRCLE_RADIUS + 30, 0, 0);   // x轴箭头
    drawArrow(0, -CIRCLE_RADIUS - 30, 90); // y轴箭头
    
    // 绘制刻度
    stroke(COLORS.axis);
    strokeWeight(1);
    
    // x轴刻度
    line(CIRCLE_RADIUS, -5, CIRCLE_RADIUS, 5); // 1
    line(-CIRCLE_RADIUS, -5, -CIRCLE_RADIUS, 5); // -1
    
    // y轴刻度
    line(-5, CIRCLE_RADIUS, 5, CIRCLE_RADIUS); // -1
    line(-5, -CIRCLE_RADIUS, 5, -CIRCLE_RADIUS); // 1
    
    // 绘制刻度标签
    if (showLabels) {
        noStroke();
        fill(COLORS.text);
        textAlign(CENTER, TOP);
        textSize(12);
        text("1", CIRCLE_RADIUS, 10);
        text("-1", -CIRCLE_RADIUS, 10);
        
        textAlign(RIGHT, CENTER);
        text("1", -10, -CIRCLE_RADIUS);
        text("-1", -10, CIRCLE_RADIUS);
        
        textAlign(RIGHT, TOP);
        text("O", -10, 10);
        
        textAlign(CENTER, TOP);
        text("x", CIRCLE_RADIUS + 30, 10);
        
        textAlign(RIGHT, CENTER);
        text("y", -10, -CIRCLE_RADIUS - 20);
    }
}

// 绘制箭头
function drawArrow(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle * Math.PI / 180);
    fill(COLORS.axis);
    noStroke();
    triangle(0, 0, -10, -5, -10, 5);
    pop();
}

// 绘制角度
function drawAngle(radians, cosValue, sinValue) {
    // 计算点坐标
    const x = cosValue * CIRCLE_RADIUS;
    const y = -sinValue * CIRCLE_RADIUS; // 注意y轴是向下为正，所以要取负
    
    // 绘制从原点到点的连线
    stroke(COLORS.angle);
    strokeWeight(2);
    line(0, 0, x, y);
    
    // 绘制角度弧
    noFill();
    stroke(COLORS.angle);
    strokeWeight(1);
    arc(0, 0, 50, 50, -Math.PI/2, -Math.PI/2 + radians, PIE);
    
    // 绘制点
    fill(COLORS.point);
    noStroke();
    circle(x, y, 8);
    
    // 绘制角度标签
    if (showLabels) {
        fill(COLORS.angle);
        noStroke();
        textSize(14);
        textAlign(CENTER, CENTER);
        
        // 计算角度标签位置
        const labelRadius = 30;
        const labelX = labelRadius * Math.cos(-Math.PI/2 + radians/2);
        const labelY = labelRadius * Math.sin(-Math.PI/2 + radians/2);
        
        text("θ", labelX, labelY);
        
        // 绘制点的坐标标签
        textSize(12);
        textAlign(LEFT, CENTER);
        text(`(cos θ, sin θ) = (${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`, x + 15, y);
    }
}

// 绘制正弦线
function drawSin(sinValue) {
    stroke(COLORS.sin);
    strokeWeight(2);
    
    // 从单位圆上的点绘制到y轴
    const y = -sinValue * CIRCLE_RADIUS;
    line(0, y, 0, 0);
    
    // 绘制正弦值标记
    fill(COLORS.sin);
    noStroke();
    circle(0, y, 6);
    
    // 绘制正弦值标签
    if (showLabels) {
        textAlign(RIGHT, CENTER);
        textSize(12);
        text(`sin θ = ${sinValue.toFixed(2)}`, -10, y);
    }
}

// 绘制余弦线
function drawCos(cosValue) {
    stroke(COLORS.cos);
    strokeWeight(2);
    
    // 从单位圆上的点绘制到x轴
    const x = cosValue * CIRCLE_RADIUS;
    line(x, 0, 0, 0);
    
    // 绘制余弦值标记
    fill(COLORS.cos);
    noStroke();
    circle(x, 0, 6);
    
    // 绘制余弦值标签
    if (showLabels) {
        textAlign(CENTER, TOP);
        textSize(12);
        text(`cos θ = ${cosValue.toFixed(2)}`, x, 10);
    }
}

// 绘制正切线
function drawTan(tanValue, cosValue) {
    // 正切线只在特定范围内绘制
    if (Math.abs(cosValue) < 0.05) return; // 避免除以零附近的情况
    
    // 计算正切线与单位圆外x轴交点
    const x = CIRCLE_RADIUS;
    const y = -tanValue * CIRCLE_RADIUS;
    
    // 如果正切值过大，限制绘制范围
    if (Math.abs(y) > CIRCLE_RADIUS * 3) {
        const limitedY = y > 0 ? -CIRCLE_RADIUS * 3 : CIRCLE_RADIUS * 3;
        
        stroke(COLORS.tan);
        strokeWeight(2);
        line(x, 0, x, limitedY);
        
        // 绘制箭头表示延伸
        fill(COLORS.tan);
        noStroke();
        if (y > 0) {
            triangle(x, limitedY, x - 5, limitedY + 10, x + 5, limitedY + 10);
        } else {
            triangle(x, limitedY, x - 5, limitedY - 10, x + 5, limitedY - 10);
        }
    } else {
        stroke(COLORS.tan);
        strokeWeight(2);
        line(x, 0, x, y);
        
        // 绘制正切值标记
        fill(COLORS.tan);
        noStroke();
        circle(x, y, 6);
        
        // 绘制正切值标签
        if (showLabels) {
            textAlign(LEFT, CENTER);
            textSize(12);
            text(`tan θ = ${tanValue.toFixed(2)}`, x + 10, y);
        }
    }
}

// 绘制函数图像
function drawGraph(currentRadians) {
    // 绘制坐标轴
    stroke(COLORS.axis);
    strokeWeight(2);
    
    // x轴 (表示角度)
    line(0, 0, GRAPH_WIDTH, 0);
    
    // y轴 (表示函数值)
    line(0, -GRAPH_HEIGHT, 0, GRAPH_HEIGHT);
    
    // 绘制网格线
    stroke(COLORS.grid);
    strokeWeight(1);
    
    // 水平网格线
    for (let y = -GRAPH_HEIGHT; y <= GRAPH_HEIGHT; y += GRAPH_HEIGHT/2) {
        line(0, y, GRAPH_WIDTH, y);
    }
    
    // 垂直网格线表示π/2的倍数
    for (let x = 0; x <= GRAPH_WIDTH; x += GRAPH_WIDTH/4) {
        line(x, -GRAPH_HEIGHT, x, GRAPH_HEIGHT);
    }
    
    // 绘制标签
    if (showLabels) {
        noStroke();
        fill(COLORS.text);
        textSize(12);
        
        // x轴标签
        textAlign(CENTER, TOP);
        text("0", 0, 5);
        text("π/2", GRAPH_WIDTH/4, 5);
        text("π", GRAPH_WIDTH/2, 5);
        text("3π/2", GRAPH_WIDTH*3/4, 5);
        text("2π", GRAPH_WIDTH, 5);
        
        // y轴标签
        textAlign(RIGHT, CENTER);
        text("1", -5, -GRAPH_HEIGHT/2);
        text("0", -5, 0);
        text("-1", -5, GRAPH_HEIGHT/2);
    }
    
    // 绘制当前角度的垂直线
    const currentX = (currentRadians / (2 * Math.PI)) * GRAPH_WIDTH;
    stroke(COLORS.angle);
    strokeWeight(1);
    line(currentX, -GRAPH_HEIGHT, currentX, GRAPH_HEIGHT);
    
    // 绘制正弦函数曲线
    if (showSin) {
        noFill();
        stroke(COLORS.sin);
        strokeWeight(2);
        beginShape();
        for (let x = 0; x <= GRAPH_WIDTH; x++) {
            const angle = (x / GRAPH_WIDTH) * 2 * Math.PI;
            const y = -Math.sin(angle) * GRAPH_HEIGHT/2; // 取负是因为canvas的y轴向下为正
            vertex(x, y);
        }
        endShape();
        
        // 标记当前正弦值
        const currentSinY = -Math.sin(currentRadians) * GRAPH_HEIGHT/2;
        fill(COLORS.sin);
        noStroke();
        circle(currentX, currentSinY, 6);
    }
    
    // 绘制余弦函数曲线
    if (showCos) {
        noFill();
        stroke(COLORS.cos);
        strokeWeight(2);
        beginShape();
        for (let x = 0; x <= GRAPH_WIDTH; x++) {
            const angle = (x / GRAPH_WIDTH) * 2 * Math.PI;
            const y = -Math.cos(angle) * GRAPH_HEIGHT/2;
            vertex(x, y);
        }
        endShape();
        
        // 标记当前余弦值
        const currentCosY = -Math.cos(currentRadians) * GRAPH_HEIGHT/2;
        fill(COLORS.cos);
        noStroke();
        circle(currentX, currentCosY, 6);
    }
    
    // 绘制正切函数曲线
    if (showTan) {
        noFill();
        stroke(COLORS.tan);
        strokeWeight(2);
        
        // 正切函数需要分段绘制，因为在π/2的奇数倍处有不连续点
        for (let segment = 0; segment < 4; segment++) {
            beginShape();
            for (let x = segment * GRAPH_WIDTH/4 + 1; x < (segment + 1) * GRAPH_WIDTH/4 - 1; x++) {
                const angle = (x / GRAPH_WIDTH) * 2 * Math.PI;
                // 限制正切值的范围，因为其可以无限大
                const tanValue = Math.tan(angle);
                const y = -constrain(tanValue, -3, 3) * GRAPH_HEIGHT/6;
                vertex(x, y);
            }
            endShape();
        }
        
        // 标记当前正切值
        if (Math.abs(Math.cos(currentRadians)) > 0.05) { // 避免在不连续处绘制
            const currentTanY = -constrain(Math.tan(currentRadians), -3, 3) * GRAPH_HEIGHT/6;
            fill(COLORS.tan);
            noStroke();
            circle(currentX, currentTanY, 6);
        }
    }
}

// 更新角度
function updateAngle() {
    angle = parseFloat(document.getElementById('angle-slider').value);
    document.getElementById('angle-display').textContent = Math.round(angle) + '°';
    updateTrigValues();
}

// 更新旋转速度
function updateSpeed() {
    speed = parseFloat(document.getElementById('speed-slider').value);
    document.getElementById('speed-display').textContent = speed.toFixed(1);
}

// 更新正弦函数显示设置
function updateSinVisibility() {
    showSin = document.getElementById('show-sin').checked;
}

// 更新余弦函数显示设置
function updateCosVisibility() {
    showCos = document.getElementById('show-cos').checked;
}

// 更新正切函数显示设置
function updateTanVisibility() {
    showTan = document.getElementById('show-tan').checked;
}

// 更新函数图像显示设置
function updateGraphVisibility() {
    showGraph = document.getElementById('show-graph').checked;
}

// 更新标签显示设置
function updateLabelsVisibility() {
    showLabels = document.getElementById('show-labels').checked;
}

// 更新三角函数值显示
function updateTrigValues() {
    const radians = angle * Math.PI / 180;
    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);
    
    document.getElementById('sin-value').textContent = sinValue.toFixed(4);
    document.getElementById('cos-value').textContent = cosValue.toFixed(4);
    document.getElementById('tan-value').textContent = 
        Math.abs(cosValue) < 0.001 ? "无定义" : tanValue.toFixed(4);
} 