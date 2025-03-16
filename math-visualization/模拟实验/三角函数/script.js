// 全局变量
let canvas;
let angle = 45; // 初始角度（度）
let speed = 0; // 旋转速度
let showSine = true;
let showCosine = true;
let showTangent = false;

// 函数变换参数
let amplitude = 1.0;
let frequency = 1.0;
let phase = 0.0;
let verticalOffset = 0.0;

// 单位圆设置
const CIRCLE_RADIUS = 120; // 单位圆半径（像素）
const GRAPH_WIDTH = 600; // 函数图像宽度
const GRAPH_HEIGHT = 300; // 函数图像高度

// 颜色设置
const COLORS = {
    background: '#f5f5f5',
    circle: '#dddddd',
    axis: '#333333',
    angle: '#666666',
    sin: '#3f51b5', // 蓝色 - 正弦
    cos: '#e91e63', // 粉色 - 余弦
    tan: '#4caf50', // 绿色 - 正切
    point: '#9b59b6', // 紫色
    grid: '#eeeeee',
    text: '#333333'
};

// p5.js 初始化函数
function setup() {
    console.log('setup函数被调用');
    // 创建画布
    canvas = createCanvas(700, 400);
    
    // 根据当前活动标签页确定画布的放置位置
    const unitCircleTab = document.getElementById('unit-circle');
    const graphsTab = document.getElementById('function-graphs');
    
    if (unitCircleTab && unitCircleTab.classList.contains('active')) {
        console.log('将画布放入unit-circle-canvas');
        canvas.parent('unit-circle-canvas');
    } else if (graphsTab && graphsTab.classList.contains('active')) {
        console.log('将画布放入graphs-canvas');
        canvas.parent('graphs-canvas');
    } else {
        // 默认放在单位圆容器中
        console.log('默认将画布放入unit-circle-canvas');
        canvas.parent('unit-circle-canvas');
    }
    
    // 设置事件监听器
    setupEventListeners();
    
    // 监听标签页切换事件
    document.addEventListener('tabchange', function(e) {
        console.log('标签页切换事件触发:', e.detail.tabId);
        
        const tabId = e.detail.tabId;
        if (tabId === 'unit-circle') {
            canvas.parent('unit-circle-canvas');
        } else if (tabId === 'function-graphs') {
            canvas.parent('graphs-canvas');
        }
    });
    
    // 初始化显示
    updateTrigValues();
    updateFormulaDisplay();
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器');
    
    // 角度控制
    const angleSlider = document.getElementById('angle-slider');
    if (angleSlider) {
        angleSlider.addEventListener('input', function() {
            angle = parseFloat(this.value);
            
            // 更新度数显示
            const displayElement = document.getElementById('angle-display');
            if (displayElement) {
                displayElement.textContent = angle.toFixed(1) + '°';
            }
            
            // 更新弧度显示和滑块
            const radians = (angle * Math.PI / 180).toFixed(2);
            const radianDisplay = document.getElementById('radian-display');
            const radianSlider = document.getElementById('radian-slider');
            
            if (radianDisplay) {
                radianDisplay.textContent = radians;
            }
            
            if (radianSlider) {
                radianSlider.value = radians;
            }
            
            updateTrigValues();
        });
    }
    
    const radianSlider = document.getElementById('radian-slider');
    if (radianSlider) {
        radianSlider.addEventListener('input', function() {
            const radians = parseFloat(this.value);
            
            // 更新弧度显示
            const displayElement = document.getElementById('radian-display');
            if (displayElement) {
                displayElement.textContent = radians.toFixed(2);
            }
            
            // 更新角度显示和滑块
            angle = (radians * 180 / Math.PI);
            const angleDisplay = document.getElementById('angle-display');
            const angleSlider = document.getElementById('angle-slider');
            
            if (angleDisplay) {
                angleDisplay.textContent = angle.toFixed(1) + '°';
            }
            
            if (angleSlider) {
                angleSlider.value = angle;
            }
            
            updateTrigValues();
        });
    }
    
    // 显示控制
    const showSineCheckbox = document.getElementById('show-sine');
    if (showSineCheckbox) {
        showSineCheckbox.addEventListener('change', function() {
            showSine = this.checked;
        });
    }
    
    const showCosineCheckbox = document.getElementById('show-cosine');
    if (showCosineCheckbox) {
        showCosineCheckbox.addEventListener('change', function() {
            showCosine = this.checked;
        });
    }
    
    const showTangentCheckbox = document.getElementById('show-tangent');
    if (showTangentCheckbox) {
        showTangentCheckbox.addEventListener('change', function() {
            showTangent = this.checked;
        });
    }
    
    // 函数图像选择
    const showSinGraph = document.getElementById('show-sin-graph');
    if (showSinGraph) {
        showSinGraph.addEventListener('change', updateFormulaDisplay);
    }
    
    const showCosGraph = document.getElementById('show-cos-graph');
    if (showCosGraph) {
        showCosGraph.addEventListener('change', updateFormulaDisplay);
    }
    
    const showTanGraph = document.getElementById('show-tan-graph');
    if (showTanGraph) {
        showTanGraph.addEventListener('change', updateFormulaDisplay);
    }
    
    // 函数变换控制
    const amplitudeSlider = document.getElementById('amplitude-slider');
    if (amplitudeSlider) {
        amplitudeSlider.addEventListener('input', function() {
            amplitude = parseFloat(this.value);
            document.getElementById('amplitude-display').textContent = amplitude.toFixed(1);
            updateFormulaDisplay();
        });
    }
    
    const frequencySlider = document.getElementById('frequency-slider');
    if (frequencySlider) {
        frequencySlider.addEventListener('input', function() {
            frequency = parseFloat(this.value);
            document.getElementById('frequency-display').textContent = frequency.toFixed(1);
            updateFormulaDisplay();
        });
    }
    
    const phaseSlider = document.getElementById('phase-slider');
    if (phaseSlider) {
        phaseSlider.addEventListener('input', function() {
            phase = parseFloat(this.value);
            document.getElementById('phase-display').textContent = phase.toFixed(1);
            updateFormulaDisplay();
        });
    }
    
    const offsetSlider = document.getElementById('offset-slider');
    if (offsetSlider) {
        offsetSlider.addEventListener('input', function() {
            verticalOffset = parseFloat(this.value);
            document.getElementById('offset-display').textContent = verticalOffset.toFixed(1);
            updateFormulaDisplay();
        });
    }
    
    // 按钮控制
    const animateBtn = document.getElementById('animate-btn');
    if (animateBtn) {
        animateBtn.addEventListener('click', function() {
            speed = speed > 0 ? 0 : 1;
            this.innerHTML = speed > 0 ? 
                '<i class="bi bi-pause-fill"></i> 暂停动画' : 
                '<i class="bi bi-play-fill"></i> 动画演示';
        });
    }
    
    const resetTransformsBtn = document.getElementById('reset-transforms-btn');
    if (resetTransformsBtn) {
        resetTransformsBtn.addEventListener('click', function() {
            // 重置所有变换参数
            amplitude = 1.0;
            frequency = 1.0;
            phase = 0.0;
            verticalOffset = 0.0;
            
            // 更新滑块显示
            if (document.getElementById('amplitude-slider')) {
                document.getElementById('amplitude-slider').value = amplitude;
                document.getElementById('amplitude-display').textContent = amplitude.toFixed(1);
            }
            
            if (document.getElementById('frequency-slider')) {
                document.getElementById('frequency-slider').value = frequency;
                document.getElementById('frequency-display').textContent = frequency.toFixed(1);
            }
            
            if (document.getElementById('phase-slider')) {
                document.getElementById('phase-slider').value = phase;
                document.getElementById('phase-display').textContent = phase.toFixed(1);
            }
            
            if (document.getElementById('offset-slider')) {
                document.getElementById('offset-slider').value = verticalOffset;
                document.getElementById('offset-display').textContent = verticalOffset.toFixed(1);
            }
            
            updateFormulaDisplay();
        });
    }
}

// 更新三角函数值显示
function updateTrigValues() {
    const radians = angle * Math.PI / 180;
    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);
    
    // 更新显示
    const sineElement = document.getElementById('sine-value');
    const cosineElement = document.getElementById('cosine-value');
    const tangentElement = document.getElementById('tangent-value');
    
    if (sineElement) {
        sineElement.textContent = sinValue.toFixed(4);
    }
    
    if (cosineElement) {
        cosineElement.textContent = cosValue.toFixed(4);
    }
    
    if (tangentElement) {
        if (Math.abs(cosValue) < 0.00001) {
            tangentElement.textContent = "无穷大";
        } else {
            tangentElement.textContent = tanValue.toFixed(4);
        }
    }
}

// 更新函数表达式显示
function updateFormulaDisplay() {
    const formulaElement = document.getElementById('current-formula');
    if (!formulaElement) return;
    
    let formula = '';
    
    if (document.getElementById('show-sin-graph') && document.getElementById('show-sin-graph').checked) {
        formula = `y = ${amplitude !== 1 ? amplitude.toFixed(1) : ''}sin(${frequency !== 1 ? frequency.toFixed(1) : ''}x`;
        
        if (phase !== 0) {
            formula += phase > 0 ? ` + ${phase.toFixed(1)}` : ` - ${Math.abs(phase).toFixed(1)}`;
        }
        
        formula += ')';
        
        if (verticalOffset !== 0) {
            formula += verticalOffset > 0 ? ` + ${verticalOffset.toFixed(1)}` : ` - ${Math.abs(verticalOffset).toFixed(1)}`;
        }
    } else if (document.getElementById('show-cos-graph') && document.getElementById('show-cos-graph').checked) {
        formula = `y = ${amplitude !== 1 ? amplitude.toFixed(1) : ''}cos(${frequency !== 1 ? frequency.toFixed(1) : ''}x`;
        
        if (phase !== 0) {
            formula += phase > 0 ? ` + ${phase.toFixed(1)}` : ` - ${Math.abs(phase).toFixed(1)}`;
        }
        
        formula += ')';
        
        if (verticalOffset !== 0) {
            formula += verticalOffset > 0 ? ` + ${verticalOffset.toFixed(1)}` : ` - ${Math.abs(verticalOffset).toFixed(1)}`;
        }
    } else if (document.getElementById('show-tan-graph') && document.getElementById('show-tan-graph').checked) {
        formula = `y = ${amplitude !== 1 ? amplitude.toFixed(1) : ''}tan(${frequency !== 1 ? frequency.toFixed(1) : ''}x`;
        
        if (phase !== 0) {
            formula += phase > 0 ? ` + ${phase.toFixed(1)}` : ` - ${Math.abs(phase).toFixed(1)}`;
        }
        
        formula += ')';
        
        if (verticalOffset !== 0) {
            formula += verticalOffset > 0 ? ` + ${verticalOffset.toFixed(1)}` : ` - ${Math.abs(verticalOffset).toFixed(1)}`;
        }
    } else {
        formula = 'y = 0';
    }
    
    formulaElement.textContent = formula;
}

// p5.js 绘制函数
function draw() {
    console.log('draw函数被调用');
    
    background(COLORS.background);
    
    // 确定当前活动的标签页
    const unitCircleTab = document.getElementById('unit-circle');
    const graphsTab = document.getElementById('function-graphs');
    
    if (unitCircleTab && unitCircleTab.classList.contains('active')) {
        // 在单位圆标签页绘制
        drawUnitCircle();
    } else if (graphsTab && graphsTab.classList.contains('active')) {
        // 在函数图像标签页绘制
        drawFunctionGraphs();
    }
    
    // 如果有旋转速度，更新角度值
    if (speed > 0) {
        angle = (angle + speed) % 360;
        const angleSlider = document.getElementById('angle-slider');
        if (angleSlider) {
            angleSlider.value = angle;
        }
        
        // 更新显示值
        const angleDisplay = document.getElementById('angle-display');
        if (angleDisplay) {
            angleDisplay.textContent = angle.toFixed(1) + '°';
        }
        
        const radians = (angle * Math.PI / 180).toFixed(2);
        const radianDisplay = document.getElementById('radian-display');
        const radianSlider = document.getElementById('radian-slider');
        
        if (radianDisplay) {
            radianDisplay.textContent = radians;
        }
        
        if (radianSlider) {
            radianSlider.value = radians;
        }
        
        updateTrigValues();
    }
}

// 绘制单位圆标签页内容
function drawUnitCircle() {
    console.log('绘制单位圆内容');
    
    // 计算角度的弧度值
    const radians = angle * Math.PI / 180;
    
    // 计算三角函数值
    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);
    
    // 设置坐标系中心
    translate(width/2, height/2);
    
    // 绘制单位圆和坐标轴
    drawCoordinateSystem();
    
    // 绘制角度弧和半径
    drawAngleArc(radians);
    
    // 绘制单位圆上的点
    drawPointOnCircle(cosValue, sinValue);
    
    // 绘制三角函数线
    if (showSine) drawSine(sinValue);
    if (showCosine) drawCosine(cosValue);
    if (showTangent && Math.abs(cosValue) > 0.00001) drawTangent(tanValue, cosValue);
}

// 绘制函数图像标签页内容
function drawFunctionGraphs() {
    console.log('绘制函数图像内容');
    
    // 设置坐标系原点
    translate(width/2, height/2);
    
    // 绘制坐标系
    drawGraphCoordinateSystem();
    
    // 确定当前选中的函数
    const showSin = document.getElementById('show-sin-graph') && document.getElementById('show-sin-graph').checked;
    const showCos = document.getElementById('show-cos-graph') && document.getElementById('show-cos-graph').checked;
    const showTan = document.getElementById('show-tan-graph') && document.getElementById('show-tan-graph').checked;
    
    // 绘制对应的函数图像
    if (showSin) {
        drawSinGraph();
    } else if (showCos) {
        drawCosGraph();
    } else if (showTan) {
        drawTanGraph();
    }
    
    // 绘制当前角度标记线
    drawCurrentAngleLine();
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
    line(-width/2, 0, width/2, 0); // x轴
    line(0, -height/2, 0, height/2); // y轴
    
    // 绘制坐标轴箭头
    drawArrow(width/2, 0, 0, 10); // x轴箭头
    drawArrow(0, -height/2, 1.5 * Math.PI, 10); // y轴箭头
    
    // 绘制坐标轴标签
    noStroke();
    fill(COLORS.text);
    textSize(16);
    textAlign(CENTER, TOP);
    text("x", width/2 - 20, 10);
    textAlign(LEFT, CENTER);
    text("y", 10, -height/2 + 20);
    
    // 绘制刻度
    stroke(COLORS.axis);
    strokeWeight(1);
    textSize(12);
    
    // x轴刻度
    for (let x = -CIRCLE_RADIUS; x <= CIRCLE_RADIUS; x += CIRCLE_RADIUS/2) {
        if (x === 0) continue;
        line(x, -5, x, 5);
        noStroke();
        fill(COLORS.text);
        textAlign(CENTER, TOP);
        text(x/CIRCLE_RADIUS, x, 10);
        stroke(COLORS.axis);
    }
    
    // y轴刻度
    for (let y = -CIRCLE_RADIUS; y <= CIRCLE_RADIUS; y += CIRCLE_RADIUS/2) {
        if (y === 0) continue;
        line(-5, y, 5, y);
        noStroke();
        fill(COLORS.text);
        textAlign(RIGHT, CENTER);
        text(y/CIRCLE_RADIUS, -10, y);
        stroke(COLORS.axis);
    }
    
    // 原点标签
    noStroke();
    fill(COLORS.text);
    textAlign(RIGHT, TOP);
    text("O", -10, 10);
}

// 绘制函数图像坐标系
function drawGraphCoordinateSystem() {
    // 绘制坐标轴
    stroke(COLORS.axis);
    strokeWeight(2);
    
    const width = 600;
    const height = 300;
    
    // x轴和y轴
    line(-width/2, 0, width/2, 0);
    line(0, -height/2, 0, height/2);
    
    // 坐标轴箭头
    drawArrow(width/2, 0, 0, 10); // x轴箭头
    drawArrow(0, -height/2, 1.5 * Math.PI, 10); // y轴箭头
    
    // 绘制网格和刻度
    stroke(COLORS.grid);
    strokeWeight(1);
    
    // 水平网格线和刻度
    for (let y = -1; y <= 1; y += 0.5) {
        if (y === 0) continue;
        
        const pixelY = y * height/2;
        line(-width/2, pixelY, width/2, pixelY);
        
        noStroke();
        fill(COLORS.text);
        textSize(12);
        textAlign(RIGHT, CENTER);
        text(y.toString(), -10, pixelY);
        stroke(COLORS.grid);
    }
    
    // 垂直网格线和刻度 (表示π/2的倍数)
    for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        
        const x = i * Math.PI/2;
        const pixelX = x * width/(Math.PI * 4);
        
        line(pixelX, -height/2, pixelX, height/2);
        
        noStroke();
        fill(COLORS.text);
        textSize(12);
        textAlign(CENTER, TOP);
        
        // 标签显示
        let label;
        if (i === -2) label = "-π";
        else if (i === -1) label = "-π/2";
        else if (i === 1) label = "π/2";
        else if (i === 2) label = "π";
        
        text(label, pixelX, 10);
        stroke(COLORS.grid);
    }
    
    // 原点标签
    noStroke();
    fill(COLORS.text);
    textSize(12);
    textAlign(CENTER, TOP);
    text("0", 0, 10);
}

// 绘制单位圆上的点
function drawPointOnCircle(cosValue, sinValue) {
    const x = cosValue * CIRCLE_RADIUS;
    const y = -sinValue * CIRCLE_RADIUS; // 注意y轴方向翻转
    
    // 绘制从原点到点的线段
    stroke(COLORS.point);
    strokeWeight(2);
    line(0, 0, x, y);
    
    // 绘制点
    fill(COLORS.point);
    noStroke();
    circle(x, y, 8);
    
    // 显示点的坐标标签
        textSize(14);
        textAlign(LEFT, CENTER);
    const labelX = x + (x >= 0 ? 10 : -40);
    const labelY = y + (y >= 0 ? -10 : 20);
    text(`(${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`, labelX, labelY);
}

// 绘制角度弧
function drawAngleArc(radians) {
    // 绘制角度弧
    noFill();
    stroke(COLORS.angle);
    strokeWeight(2);
    const arcRadius = 30;
    arc(0, 0, arcRadius * 2, arcRadius * 2, -HALF_PI, radians - HALF_PI);
    
    // 绘制角度标记
    const labelRadius = arcRadius + 15;
    const labelAngle = radians / 2 - HALF_PI;
    const labelX = cos(labelAngle) * labelRadius;
    const labelY = sin(labelAngle) * labelRadius;
    
    noStroke();
    fill(COLORS.angle);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(`θ`, labelX, labelY);
}

// 绘制正弦线和值
function drawSine(sinValue) {
    const y = -sinValue * CIRCLE_RADIUS;
    
    // 绘制到y轴的投影线
    stroke(COLORS.sin);
    strokeWeight(1);
    setLineDash([5, 3]);
    line(0, y, 0, 0);
    resetLineDash();
    
    // 绘制正弦线
    strokeWeight(2);
    line(0, 0, 0, y);
    
    // 显示正弦值标签
    noStroke();
    fill(COLORS.sin);
    textSize(14);
        textAlign(RIGHT, CENTER);
    text(`sin(θ) = ${sinValue.toFixed(2)}`, -10, y/2);
}

// 绘制余弦线和值
function drawCosine(cosValue) {
    const x = cosValue * CIRCLE_RADIUS;
    
    // 绘制到x轴的投影线
    stroke(COLORS.cos);
    strokeWeight(1);
    setLineDash([5, 3]);
    line(x, 0, 0, 0);
    resetLineDash();
    
    // 绘制余弦线
    strokeWeight(2);
    line(0, 0, x, 0);
    
    // 显示余弦值标签
    noStroke();
    fill(COLORS.cos);
    textSize(14);
        textAlign(CENTER, TOP);
    text(`cos(θ) = ${cosValue.toFixed(2)}`, x/2, 10);
}

// 绘制正切线和值
function drawTangent(tanValue, cosValue) {
    // 只有当cos不是0时才绘制正切
    if (Math.abs(cosValue) < 0.00001) return;
    
    // 绘制正切线
        stroke(COLORS.tan);
    strokeWeight(2);
    
    // 计算正切线的端点
    const tanX = CIRCLE_RADIUS;
    const tanY = -tanValue * CIRCLE_RADIUS;
    
    // 绘制到正切线的水平投影
    setLineDash([5, 3]);
    line(tanX, 0, tanX, tanY);
    resetLineDash();
    
    // 绘制正切线
    strokeWeight(2);
    line(0, 0, tanX, tanY);
    
    // 显示正切值标签
    noStroke();
    fill(COLORS.tan);
    textSize(14);
    textAlign(LEFT, CENTER);
    
    if (Math.abs(tanY) > CIRCLE_RADIUS * 2) {
        // 如果正切值过大，则只显示一个缩写版本
        text(`tan(θ) = ${tanValue.toFixed(2)}`, tanX + 10, CIRCLE_RADIUS);
    } else {
        text(`tan(θ) = ${tanValue.toFixed(2)}`, tanX + 10, tanY/2);
    }
}

// 绘制正弦函数图像
function drawSinGraph() {
    const width = 600;
    const height = 300;
    
        noFill();
        stroke(COLORS.sin);
        strokeWeight(2);
    
        beginShape();
    for (let x = -width/2; x <= width/2; x++) {
        const angle = (x / (width/(4*Math.PI))) * frequency + phase;
        const y = -amplitude * Math.sin(angle) * height/4 - verticalOffset * height/4;
        
        // 只在可见范围内绘制
        if (y >= -height/2 && y <= height/2) {
            vertex(x, y);
        }
        }
        endShape();
        
    // 绘制当前角度对应的点
    const currentAngle = (angle * Math.PI / 180) * frequency + phase;
    const currentX = (currentAngle * width/(4*Math.PI)) % width - width/2;
    const currentY = -amplitude * Math.sin(currentAngle) * height/4 - verticalOffset * height/4;
    
    if (currentY >= -height/2 && currentY <= height/2 && currentX >= -width/2 && currentX <= width/2) {
        fill(COLORS.sin);
        noStroke();
        circle(currentX, currentY, 8);
    }
}

// 绘制余弦函数图像
function drawCosGraph() {
    const width = 600;
    const height = 300;
    
        noFill();
        stroke(COLORS.cos);
        strokeWeight(2);
    
        beginShape();
    for (let x = -width/2; x <= width/2; x++) {
        const angle = (x / (width/(4*Math.PI))) * frequency + phase;
        const y = -amplitude * Math.cos(angle) * height/4 - verticalOffset * height/4;
        
        // 只在可见范围内绘制
        if (y >= -height/2 && y <= height/2) {
            vertex(x, y);
        }
        }
        endShape();
        
    // 绘制当前角度对应的点
    const currentAngle = (angle * Math.PI / 180) * frequency + phase;
    const currentX = (currentAngle * width/(4*Math.PI)) % width - width/2;
    const currentY = -amplitude * Math.cos(currentAngle) * height/4 - verticalOffset * height/4;
    
    if (currentY >= -height/2 && currentY <= height/2 && currentX >= -width/2 && currentX <= width/2) {
        fill(COLORS.cos);
        noStroke();
        circle(currentX, currentY, 8);
    }
}

// 绘制正切函数图像
function drawTanGraph() {
    const width = 600;
    const height = 300;
    
        noFill();
        stroke(COLORS.tan);
        strokeWeight(2);
        
    // 用多段线分别绘制正切函数，避开渐近线
    const segments = [];
    let currentSegment = [];
    
    for (let x = -width/2; x <= width/2; x++) {
        const angle = (x / (width/(4*Math.PI))) * frequency + phase;
        
        // 检查是否接近渐近线 (x = π/2 + nπ)
        const modAngle = angle % Math.PI;
        if (Math.abs(modAngle - Math.PI/2) < 0.1) {
            if (currentSegment.length > 0) {
                segments.push(currentSegment);
                currentSegment = [];
            }
            continue;
        }
        
        const y = -amplitude * Math.tan(angle) * height/6 - verticalOffset * height/4;
        
        // 只添加在可见范围内且数值合理的点
        if (y >= -height/2 && y <= height/2 && isFinite(y) && !isNaN(y)) {
            currentSegment.push({x, y});
        } else if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
        }
    }
    
    // 添加最后一个线段
    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }
    
    // 绘制所有线段
    for (const segment of segments) {
        beginShape();
        for (const point of segment) {
            vertex(point.x, point.y);
        }
        endShape();
    }
    
    // 绘制当前角度对应的点
    const currentAngle = (angle * Math.PI / 180) * frequency + phase;
    const normalized = currentAngle % Math.PI;
    
    // 如果不接近渐近线，则绘制点
    if (Math.abs(normalized - Math.PI/2) >= 0.1) {
        const currentX = (currentAngle * width/(4*Math.PI)) % width - width/2;
        const currentY = -amplitude * Math.tan(currentAngle) * height/6 - verticalOffset * height/4;
        
        if (currentY >= -height/2 && currentY <= height/2 && currentX >= -width/2 && currentX <= width/2 && 
            !isNaN(currentY) && isFinite(currentY)) {
            fill(COLORS.tan);
            noStroke();
            circle(currentX, currentY, 8);
        }
    }
}

// 绘制当前角度的垂直标记线
function drawCurrentAngleLine() {
    const width = 600;
    const height = 300;
    
    const currentAngle = angle * Math.PI / 180;
    const currentX = (currentAngle * width/(4*Math.PI)) % width - width/2;
    
    if (currentX >= -width/2 && currentX <= width/2) {
        stroke(COLORS.angle);
        strokeWeight(1);
        setLineDash([5, 5]);
        line(currentX, -height/2, currentX, height/2);
        resetLineDash();
        
        // 绘制角度标签
        noStroke();
        fill(COLORS.angle);
        textSize(12);
        textAlign(CENTER, TOP);
        text(`θ = ${angle.toFixed(1)}°`, currentX, height/2 - 20);
    }
}

// 绘制箭头
function drawArrow(x, y, angle, size) {
    push();
    translate(x, y);
    rotate(angle);
    fill(COLORS.axis);
    noStroke();
    triangle(0, 0, -size, -size/2, -size, size/2);
    pop();
}

// 设置虚线样式
function setLineDash(pattern) {
    drawingContext.setLineDash(pattern);
}

// 重置线条样式为实线
function resetLineDash() {
    drawingContext.setLineDash([]);
} 