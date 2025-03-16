// 全局变量
let currentTab = 'vector-basics';

// 基本运算变量
let vectorAX = 3;
let vectorAY = 4;
let vectorBX = 5;
let vectorBY = -2;
let showSum = true;
let showDiff = false;
let showCoordinates = true;

// 向量积变量
let dotAX = 3;
let dotAY = 4;
let dotBX = 5;
let dotBY = -2;
let showProjection = true;
let showAngle = true;

// 线性组合变量
let basis1X = 3;
let basis1Y = 1;
let basis2X = 1;
let basis2Y = 2;
let coefficient1 = 1;
let coefficient2 = 1;

// 画布设置
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

// 坐标系设置
const GRID_SIZE = 40; // 每个单位在画布上的像素数
const ORIGIN_X = CANVAS_WIDTH / 2;
const ORIGIN_Y = CANVAS_HEIGHT / 2;

// 颜色设置
const COLORS = {
    background: '#f8f9fa',
    grid: '#e9ecef',
    axis: '#343a40',
    vectorA: '#3498db', // 蓝色
    vectorB: '#e74c3c', // 红色
    vectorSum: '#2ecc71', // 绿色
    vectorDiff: '#9b59b6', // 紫色
    projection: '#f39c12', // 橙色
    angle: '#1abc9c', // 青色
    text: '#2c3e50',
    area: 'rgba(52, 152, 219, 0.2)' // 半透明蓝色
};

// p5.js 实例对象
let basicsSketch, productsSketch, linearSketch;

// 为每个标签页创建p5.js实例 - 使用实例模式
window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 内容已加载");
    
    // 基础向量运算
    basicsSketch = new p5(function(p) {
        p.setup = function() {
            const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            canvas.parent('basics-canvas');
            console.log("基础向量运算画布已创建");
            
            // 添加setLineDash方法，因为p5.js中没有内置
            p.setLineDash = function(list) {
                this.drawingContext.setLineDash(list);
            };
        };
        
        p.draw = function() {
            p.background(COLORS.background);
            
            // 绘制坐标系
            p.stroke(COLORS.grid);
            p.strokeWeight(1);
            
            // 绘制网格
            for (let x = -10; x <= 10; x++) {
                p.line(ORIGIN_X + x * GRID_SIZE, 0, ORIGIN_X + x * GRID_SIZE, CANVAS_HEIGHT);
            }
            
            for (let y = -10; y <= 10; y++) {
                p.line(0, ORIGIN_Y - y * GRID_SIZE, CANVAS_WIDTH, ORIGIN_Y - y * GRID_SIZE);
            }
            
            // 绘制坐标轴
            p.stroke(COLORS.axis);
            p.strokeWeight(2);
            p.line(0, ORIGIN_Y, CANVAS_WIDTH, ORIGIN_Y);
            p.line(ORIGIN_X, CANVAS_HEIGHT, ORIGIN_X, 0);
            
            // 绘制向量A
            drawVector(p, 0, 0, vectorAX, vectorAY, COLORS.vectorA, "A");
            
            // 绘制向量B
            drawVector(p, 0, 0, vectorBX, vectorBY, COLORS.vectorB, "B");
            
            // 绘制向量和
            if (showSum) {
                const sumX = vectorAX + vectorBX;
                const sumY = vectorAY + vectorBY;
                drawVector(p, 0, 0, sumX, sumY, COLORS.vectorSum, "A+B");
            }
            
            // 绘制向量差
            if (showDiff) {
                const diffX = vectorAX - vectorBX;
                const diffY = vectorAY - vectorBY;
                drawVector(p, 0, 0, diffX, diffY, COLORS.vectorDiff, "A-B");
                
                // 可选：用虚线绘制向量差的几何表示
                p.push();
                p.stroke(COLORS.vectorDiff);
                p.strokeWeight(1);
                p.setLineDash([5, 5]);
                const startX = ORIGIN_X + vectorBX * GRID_SIZE;
                const startY = ORIGIN_Y - vectorBY * GRID_SIZE;
                const endX = ORIGIN_X + vectorAX * GRID_SIZE;
                const endY = ORIGIN_Y - vectorAY * GRID_SIZE;
                p.line(startX, startY, endX, endY);
                p.pop();
            }
        };
    });
    
    // 向量积
    productsSketch = new p5(function(p) {
        p.setup = function() {
            const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            canvas.parent('products-canvas');
            console.log("向量积画布已创建");
            
            // 添加setLineDash方法，因为p5.js中没有内置
            p.setLineDash = function(list) {
                this.drawingContext.setLineDash(list);
            };
        };
        
        p.draw = function() {
            p.background(COLORS.background);
            
            // 绘制坐标系
            p.stroke(COLORS.grid);
            p.strokeWeight(1);
            
            // 绘制网格
            for (let x = -10; x <= 10; x++) {
                p.line(ORIGIN_X + x * GRID_SIZE, 0, ORIGIN_X + x * GRID_SIZE, CANVAS_HEIGHT);
            }
            
            for (let y = -10; y <= 10; y++) {
                p.line(0, ORIGIN_Y - y * GRID_SIZE, CANVAS_WIDTH, ORIGIN_Y - y * GRID_SIZE);
            }
            
            // 绘制坐标轴
            p.stroke(COLORS.axis);
            p.strokeWeight(2);
            p.line(0, ORIGIN_Y, CANVAS_WIDTH, ORIGIN_Y);
            p.line(ORIGIN_X, CANVAS_HEIGHT, ORIGIN_X, 0);
            
            // 绘制向量A
            drawVector(p, 0, 0, dotAX, dotAY, COLORS.vectorA, "A");
            
            // 绘制向量B
            drawVector(p, 0, 0, dotBX, dotBY, COLORS.vectorB, "B");
            
            // 计算向量信息
            const dotProduct = dotAX * dotBX + dotAY * dotBY;
            const magnitudeA = Math.sqrt(dotAX * dotAX + dotAY * dotAY);
            const magnitudeB = Math.sqrt(dotBX * dotBX + dotBY * dotBY);
            
            // 计算夹角（弧度）
            let angle = 0;
            if (magnitudeA > 0 && magnitudeB > 0) {
                angle = Math.acos(Math.min(1, Math.max(-1, dotProduct / (magnitudeA * magnitudeB))));
            }
            
            // 显示夹角
            if (showAngle && magnitudeA > 0 && magnitudeB > 0) {
                p.push();
                p.noFill();
                p.strokeWeight(2);
                p.stroke(COLORS.angle);
                
                // 绘制角度弧线
                const arcRadius = 40;
                p.arc(ORIGIN_X, ORIGIN_Y, arcRadius, arcRadius, 
                     -Math.atan2(dotAY, dotAX), -Math.atan2(dotBY, dotBX), 
                     p.OPEN);
                
                // 显示角度值
                const midAngle = (-Math.atan2(dotAY, dotAX) - Math.atan2(dotBY, dotBX)) / 2;
                const labelX = ORIGIN_X + Math.cos(midAngle) * (arcRadius + 15);
                const labelY = ORIGIN_Y + Math.sin(midAngle) * (arcRadius + 15);
                p.noStroke();
                p.fill(COLORS.angle);
                p.textAlign(p.CENTER, p.CENTER);
                p.text((angle * 180 / Math.PI).toFixed(1) + '°', labelX, labelY);
                p.pop();
            }
            
            // 显示投影
            if (showProjection && magnitudeB > 0) {
                // 计算B的单位向量
                const unitBX = dotBX / magnitudeB;
                const unitBY = dotBY / magnitudeB;
                
                // 计算A在B上的投影长度
                const projectionLength = dotProduct / magnitudeB;
                
                // 计算投影向量
                const projectionX = unitBX * projectionLength;
                const projectionY = unitBY * projectionLength;
                
                // 绘制投影向量
                p.push();
                p.stroke(COLORS.projection);
                p.strokeWeight(2);
                const projX = ORIGIN_X + projectionX * GRID_SIZE;
                const projY = ORIGIN_Y - projectionY * GRID_SIZE;
                p.line(ORIGIN_X, ORIGIN_Y, projX, projY);
                
                // 绘制从A到投影点的垂线
                p.strokeWeight(1);
                p.setLineDash([5, 5]);
                const endAX = ORIGIN_X + dotAX * GRID_SIZE;
                const endAY = ORIGIN_Y - dotAY * GRID_SIZE;
                p.line(endAX, endAY, projX, projY);
                p.pop();
                
                // 绘制投影标签
                p.push();
                p.noStroke();
                p.fill(COLORS.projection);
                p.textAlign(p.LEFT, p.CENTER);
                const labelX = (ORIGIN_X + projX) / 2 + 10;
                const labelY = (ORIGIN_Y + projY) / 2;
                p.text("投影", labelX, labelY);
                p.pop();
            }
        };
    });
    
    // 线性组合
    linearSketch = new p5(function(p) {
        p.setup = function() {
            const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            canvas.parent('linear-canvas');
            console.log("线性组合画布已创建");
        };
        
        p.draw = function() {
            p.background(COLORS.background);
            
            // 绘制坐标系
            p.stroke(COLORS.grid);
            p.strokeWeight(1);
            
            // 绘制网格
            for (let x = -10; x <= 10; x++) {
                p.line(ORIGIN_X + x * GRID_SIZE, 0, ORIGIN_X + x * GRID_SIZE, CANVAS_HEIGHT);
            }
            
            for (let y = -10; y <= 10; y++) {
                p.line(0, ORIGIN_Y - y * GRID_SIZE, CANVAS_WIDTH, ORIGIN_Y - y * GRID_SIZE);
            }
            
            // 绘制坐标轴
            p.stroke(COLORS.axis);
            p.strokeWeight(2);
            p.line(0, ORIGIN_Y, CANVAS_WIDTH, ORIGIN_Y);
            p.line(ORIGIN_X, CANVAS_HEIGHT, ORIGIN_X, 0);
            
            // 绘制基向量
            drawVector(p, 0, 0, basis1X, basis1Y, COLORS.vectorA, "v₁");
            drawVector(p, 0, 0, basis2X, basis2Y, COLORS.vectorB, "v₂");
            
            // 绘制结果向量
            const resultX = coefficient1 * basis1X + coefficient2 * basis2X;
            const resultY = coefficient1 * basis1Y + coefficient2 * basis2Y;
            drawVector(p, 0, 0, resultX, resultY, COLORS.vectorSum, "结果");
        };
    });
    
    // 设置UI交互
    setupTabEvents();
    setupBasicsEvents();
    setupProductsEvents();
    setupLinearCombinationEvents();
    
    // 初始计算和更新
    updateBasicsValues();
    updateProductsValues();
    updateLinearCombinationValues();
    
    // 确保显示初始标签页
    updateCanvasVisibility();
    
    // 延迟触发一次resize事件，确保画布正确显示
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
        console.log("resize事件已触发");
    }, 500);
});

// 设置标签页切换事件
function setupTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有标签和内容的活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // 添加当前标签和内容的活动状态
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // 更新当前标签页
            currentTab = tabId;
            updateCanvasVisibility();
        });
    });
}

// 更新画布可见性
function updateCanvasVisibility() {
    console.log("更新画布可见性，当前标签页：", currentTab);
    
    // 强制重绘当前活动的画布
    switch(currentTab) {
        case 'vector-basics':
            basicsSketch.redraw();
            break;
        case 'vector-products':
            productsSketch.redraw();
            break;
        case 'linear-combination':
            linearSketch.redraw();
            break;
    }
}

// 设置基本运算控件事件
function setupBasicsEvents() {
    // 向量 A 控件
    document.getElementById('vector-a-x').addEventListener('input', function() {
        vectorAX = parseFloat(this.value);
        document.getElementById('vector-a-x-display').textContent = vectorAX.toFixed(1);
        updateBasicsValues();
        basicsSketch.redraw();
    });
    
    document.getElementById('vector-a-y').addEventListener('input', function() {
        vectorAY = parseFloat(this.value);
        document.getElementById('vector-a-y-display').textContent = vectorAY.toFixed(1);
        updateBasicsValues();
        basicsSketch.redraw();
    });
    
    // 向量 B 控件
    document.getElementById('vector-b-x').addEventListener('input', function() {
        vectorBX = parseFloat(this.value);
        document.getElementById('vector-b-x-display').textContent = vectorBX.toFixed(1);
        updateBasicsValues();
        basicsSketch.redraw();
    });
    
    document.getElementById('vector-b-y').addEventListener('input', function() {
        vectorBY = parseFloat(this.value);
        document.getElementById('vector-b-y-display').textContent = vectorBY.toFixed(1);
        updateBasicsValues();
        basicsSketch.redraw();
    });
    
    // 显示选项控件
    document.getElementById('show-sum').addEventListener('change', function() {
        showSum = this.checked;
        basicsSketch.redraw();
    });
    
    document.getElementById('show-diff').addEventListener('change', function() {
        showDiff = this.checked;
        basicsSketch.redraw();
    });
    
    document.getElementById('show-coordinates').addEventListener('change', function() {
        showCoordinates = this.checked;
        basicsSketch.redraw();
    });
}

// 设置向量积控件事件
function setupProductsEvents() {
    // 向量 A 控件
    document.getElementById('dot-a-x').addEventListener('input', function() {
        dotAX = parseFloat(this.value);
        document.getElementById('dot-a-x-display').textContent = dotAX.toFixed(1);
        updateProductsValues();
        productsSketch.redraw();
    });
    
    document.getElementById('dot-a-y').addEventListener('input', function() {
        dotAY = parseFloat(this.value);
        document.getElementById('dot-a-y-display').textContent = dotAY.toFixed(1);
        updateProductsValues();
        productsSketch.redraw();
    });
    
    // 向量 B 控件
    document.getElementById('dot-b-x').addEventListener('input', function() {
        dotBX = parseFloat(this.value);
        document.getElementById('dot-b-x-display').textContent = dotBX.toFixed(1);
        updateProductsValues();
        productsSketch.redraw();
    });
    
    document.getElementById('dot-b-y').addEventListener('input', function() {
        dotBY = parseFloat(this.value);
        document.getElementById('dot-b-y-display').textContent = dotBY.toFixed(1);
        updateProductsValues();
        productsSketch.redraw();
    });
    
    // 显示选项控件
    document.getElementById('show-projection').addEventListener('change', function() {
        showProjection = this.checked;
        productsSketch.redraw();
    });
    
    document.getElementById('show-angle').addEventListener('change', function() {
        showAngle = this.checked;
        productsSketch.redraw();
    });
}

// 设置线性组合控件事件
function setupLinearCombinationEvents() {
    // 基向量 v₁ 控件
    document.getElementById('basis-1-x').addEventListener('input', function() {
        basis1X = parseFloat(this.value);
        document.getElementById('basis-1-x-display').textContent = basis1X.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
    
    document.getElementById('basis-1-y').addEventListener('input', function() {
        basis1Y = parseFloat(this.value);
        document.getElementById('basis-1-y-display').textContent = basis1Y.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
    
    // 基向量 v₂ 控件
    document.getElementById('basis-2-x').addEventListener('input', function() {
        basis2X = parseFloat(this.value);
        document.getElementById('basis-2-x-display').textContent = basis2X.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
    
    document.getElementById('basis-2-y').addEventListener('input', function() {
        basis2Y = parseFloat(this.value);
        document.getElementById('basis-2-y-display').textContent = basis2Y.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
    
    // 系数控件
    document.getElementById('coefficient-1').addEventListener('input', function() {
        coefficient1 = parseFloat(this.value);
        document.getElementById('coefficient-1-display').textContent = coefficient1.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
    
    document.getElementById('coefficient-2').addEventListener('input', function() {
        coefficient2 = parseFloat(this.value);
        document.getElementById('coefficient-2-display').textContent = coefficient2.toFixed(1);
        updateLinearCombinationValues();
        linearSketch.redraw();
    });
}

// 更新基本运算值
function updateBasicsValues() {
    // 计算和与差
    const sumX = vectorAX + vectorBX;
    const sumY = vectorAY + vectorBY;
    const diffX = vectorAX - vectorBX;
    const diffY = vectorAY - vectorBY;
    
    // 更新显示
    document.getElementById('vector-a-value').textContent = `(${vectorAX.toFixed(1)}, ${vectorAY.toFixed(1)})`;
    document.getElementById('vector-b-value').textContent = `(${vectorBX.toFixed(1)}, ${vectorBY.toFixed(1)})`;
    document.getElementById('sum-value').textContent = `(${sumX.toFixed(1)}, ${sumY.toFixed(1)})`;
    document.getElementById('diff-value').textContent = `(${diffX.toFixed(1)}, ${diffY.toFixed(1)})`;
}

// 更新向量积值
function updateProductsValues() {
    // 计算点积
    const dotProduct = dotAX * dotBX + dotAY * dotBY;
    
    // 计算叉积
    const crossProduct = dotAX * dotBY - dotAY * dotBX;
    
    // 计算向量模长
    const magnitudeA = Math.sqrt(dotAX * dotAX + dotAY * dotAY);
    const magnitudeB = Math.sqrt(dotBX * dotBX + dotBY * dotBY);
    
    // 计算夹角（弧度）
    let angle = 0;
    if (magnitudeA > 0 && magnitudeB > 0) {
        angle = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    }
    
    // 计算投影长度
    const projection = magnitudeB > 0 ? Math.abs(dotProduct / magnitudeB) : 0;
    
    // 更新显示
    document.getElementById('dot-product-value').textContent = dotProduct.toFixed(1);
    document.getElementById('cross-product-value').textContent = Math.abs(crossProduct).toFixed(1);
    document.getElementById('angle-value').textContent = (angle * 180 / Math.PI).toFixed(1) + '°';
    document.getElementById('projection-value').textContent = projection.toFixed(2);
}

// 更新线性组合值
function updateLinearCombinationValues() {
    // 计算线性组合
    const resultX = coefficient1 * basis1X + coefficient2 * basis2X;
    const resultY = coefficient1 * basis1Y + coefficient2 * basis2Y;
    
    // 计算行列式
    const determinant = basis1X * basis2Y - basis1Y * basis2X;
    
    // 更新显示
    document.getElementById('combination-formula').textContent = 
        `${coefficient1.toFixed(1)}(${basis1X.toFixed(1)},${basis1Y.toFixed(1)}) + ${coefficient2.toFixed(1)}(${basis2X.toFixed(1)},${basis2Y.toFixed(1)})`;
    document.getElementById('combination-result').textContent = `(${resultX.toFixed(1)}, ${resultY.toFixed(1)})`;
    document.getElementById('determinant-value').textContent = determinant.toFixed(1);
}

// 基础绘制函数 - 绘制向量
function drawVector(p, startX, startY, endX, endY, color, label) {
    // 转换为画布坐标
    const x1 = ORIGIN_X + startX * GRID_SIZE;
    const y1 = ORIGIN_Y - startY * GRID_SIZE;
    const x2 = ORIGIN_X + endX * GRID_SIZE;
    const y2 = ORIGIN_Y - endY * GRID_SIZE;
    
    // 绘制向量线段
    p.stroke(color);
    p.strokeWeight(2);
    p.line(x1, y1, x2, y2);
    
    // 绘制箭头
    const angle = Math.atan2(y1 - y2, x2 - x1);
    p.push();
    p.translate(x2, y2);
    p.rotate(p.radians(angle * 180 / Math.PI));
    p.fill(color);
    p.noStroke();
    p.triangle(0, 0, -10, -5, -10, 5);
    p.pop();
    
    // 绘制标签
    if (label) {
        p.push();
        p.noStroke();
        p.fill(color);
        p.textAlign(p.CENTER, p.CENTER);
        const offsetX = Math.cos(angle + Math.PI / 2) * 15;
        const offsetY = Math.sin(angle + Math.PI / 2) * 15;
        p.text(label, (x1 + x2) / 2 + offsetX, (y1 + y2) / 2 + offsetY);
        p.pop();
    }
    
    // 如果启用了显示坐标，绘制坐标
    if (showCoordinates) {
        p.push();
        p.translate(x2, y2);
        p.fill(color);
        p.noStroke();
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text(`(${endX.toFixed(1)}, ${endY.toFixed(1)})`, 5, -5);
        p.pop();
    }
} 