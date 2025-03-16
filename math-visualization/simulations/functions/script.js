// 函数变换可视化 - 实现P5.js实例模式下的函数绘制与交互
// 基本变换p5实例
let basicTransformSketch = (p) => {
    // 画布大小
    const width = 600;
    const height = 500;
    
    // 坐标轴设置
    const xRange = 10;  // x轴范围 [-5, 5]
    const yRange = 10;  // y轴范围 [-5, 5]
    
    // 当前函数和参数
    let currentFunction = 'sin';
    let scaleX = 1.0;
    let translateX = 0.0;
    let scaleY = 1.0;
    let translateY = 0.0;
    
    // 预设函数集合
    const functionMap = {
        sin: (x) => Math.sin(x),
        cos: (x) => Math.cos(x),
        tan: (x) => Math.tan(x),
        quadratic: (x) => x * x,
        cubic: (x) => x * x * x,
        abs: (x) => Math.abs(x)
    };
    
    // 数学函数到LaTeX表达式的映射
    const latexMap = {
        sin: '\\sin(x)',
        cos: '\\cos(x)',
        tan: '\\tan(x)',
        quadratic: 'x^2',
        cubic: 'x^3',
        abs: '|x|'
    };
    
    // 坐标转换函数（数学坐标到画布坐标）
    const mapX = (x) => (x + xRange/2) * (width / xRange);
    const mapY = (y) => height - (y + yRange/2) * (height / yRange);
    
    // 反向映射（画布坐标到数学坐标）
    const unmapX = (px) => (px / width) * xRange - xRange/2;
    const unmapY = (py) => -((py / height) * yRange - yRange/2);
    
    // 设置函数
    p.setup = () => {
        // 创建画布
        const canvas = p.createCanvas(width, height);
        canvas.parent('basic-canvas');
        
        // 设置绘图属性
        p.stroke(0);
        p.strokeWeight(1);
        p.noFill();
        
        // 初始化事件监听
        setupEventListeners();
        
        // 首次绘制
        p.draw();
    };
    
    // 绘制函数
    p.draw = () => {
        // 清空画布
        p.background(255);
        
        // 绘制坐标系
        drawGrid();
        drawAxes();
        
        // 绘制原始函数（灰色）
        drawFunction(currentFunction, 1, 0, 1, 0, p.color(180, 180, 180));
        
        // 绘制变换后的函数（蓝色）
        drawFunction(currentFunction, scaleX, translateX, scaleY, translateY, p.color(65, 105, 225));
        
        // 更新函数表达式
        updateFunctionFormula();
    };
    
    // 绘制网格
    function drawGrid() {
        p.stroke(230);
        p.strokeWeight(1);
        
        // 垂直网格线
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const px = mapX(x);
            p.line(px, 0, px, height);
        }
        
        // 水平网格线
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const py = mapY(y);
            p.line(0, py, width, py);
        }
    }
    
    // 绘制坐标轴
    function drawAxes() {
        p.stroke(0);
        p.strokeWeight(2);
        
        // x轴
        const yAxisPos = mapY(0);
        p.line(0, yAxisPos, width, yAxisPos);
        
        // y轴
        const xAxisPos = mapX(0);
        p.line(xAxisPos, 0, xAxisPos, height);
        
        // 坐标标记
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.fill(0);
        
        // x轴标记
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;
            const px = mapX(x);
            p.line(px, yAxisPos - 5, px, yAxisPos + 5);
            p.text(x, px, yAxisPos + 15);
        }
        
        // y轴标记
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;
            const py = mapY(y);
            p.line(xAxisPos - 5, py, xAxisPos + 5, py);
            p.text(y, xAxisPos - 15, py);
        }
        
        // 原点标记
        p.fill(0);
        p.noStroke();
        p.ellipse(xAxisPos, yAxisPos, 5, 5);
        p.text("O", xAxisPos - 10, yAxisPos + 10);
        
        // 坐标轴标签
        p.text("x", width - 10, yAxisPos - 10);
        p.text("y", xAxisPos + 10, 10);
    }
    
    // 绘制函数
    function drawFunction(funcName, sx, tx, sy, ty, color) {
        const func = functionMap[funcName];
        if (!func) return;
        
        p.stroke(color);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        
        // 以小步长绘制函数曲线
        for (let px = 0; px <= width; px += 1) {
            const x = unmapX(px);
            // 应用水平变换: f(ax+b)
            const transformedX = (x - tx) / sx;
            
            try {
                let y = func(transformedX);
                
                // 应用垂直变换: c·f(x)+d
                y = sy * y + ty;
                
                // 检查是否为有效值
                if (!isNaN(y) && isFinite(y) && Math.abs(y) <= yRange/2) {
                    p.vertex(px, mapY(y));
                } else {
                    // 对于不连续点，结束当前形状并开始新的形状
                    p.endShape();
                    p.beginShape();
                }
            } catch (e) {
                // 处理可能的错误（如对数函数的负值输入）
                p.endShape();
                p.beginShape();
            }
        }
        p.endShape();
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 预设函数选择
        document.querySelectorAll('.function-btn:not([data-target])').forEach(btn => {
            btn.addEventListener('click', function() {
                currentFunction = this.getAttribute('data-function');
                p.draw();
            });
        });
        
        // 水平缩放
        const scaleXSlider = document.getElementById('scale-x');
        scaleXSlider.addEventListener('input', function() {
            scaleX = parseFloat(this.value);
            document.getElementById('scale-x-display').textContent = scaleX.toFixed(1);
            p.draw();
        });
        
        // 水平平移
        const translateXSlider = document.getElementById('translate-x');
        translateXSlider.addEventListener('input', function() {
            translateX = parseFloat(this.value);
            document.getElementById('translate-x-display').textContent = translateX.toFixed(1);
            p.draw();
        });
        
        // 垂直缩放
        const scaleYSlider = document.getElementById('scale-y');
        scaleYSlider.addEventListener('input', function() {
            scaleY = parseFloat(this.value);
            document.getElementById('scale-y-display').textContent = scaleY.toFixed(1);
            p.draw();
        });
        
        // 垂直平移
        const translateYSlider = document.getElementById('translate-y');
        translateYSlider.addEventListener('input', function() {
            translateY = parseFloat(this.value);
            document.getElementById('translate-y-display').textContent = translateY.toFixed(1);
            p.draw();
        });
    }
    
    // 更新函数表达式
    function updateFunctionFormula() {
        // 原始函数表达式
        const originalLatex = latexMap[currentFunction];
        document.getElementById('function-display').innerHTML = `\\(f(x) = ${originalLatex}\\)`;
        
        // 构建变换后的函数表达式
        let transformedLatex = originalLatex;
        
        // 应用水平变换
        if (scaleX !== 1 || translateX !== 0) {
            let xExpr = 'x';
            
            // 添加平移项
            if (translateX !== 0) {
                const sign = translateX > 0 ? '-' : '+';
                xExpr = `x ${sign} ${Math.abs(translateX).toFixed(1)}`;
            }
            
            // 添加缩放项
            if (scaleX !== 1) {
                xExpr = `\\frac{${xExpr}}{${scaleX.toFixed(1)}}`;
            }
            
            // 替换表达式中的x
            transformedLatex = originalLatex.replace(/x/g, `(${xExpr})`);
        }
        
        // 应用垂直变换
        if (scaleY !== 1) {
            transformedLatex = `${scaleY.toFixed(1)} \\cdot (${transformedLatex})`;
        }
        
        if (translateY !== 0) {
            const sign = translateY > 0 ? '+' : '-';
            transformedLatex = `${transformedLatex} ${sign} ${Math.abs(translateY).toFixed(1)}`;
        }
        
        document.getElementById('transformed-function').innerHTML = `\\(g(x) = ${transformedLatex}\\)`;
        
        // 重新渲染公式
        if (window.MathJax) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }
};

// 复合变换p5实例
let compositeTransformSketch = (p) => {
    // 画布大小
    const width = 600;
    const height = 500;
    
    // 坐标轴设置
    const xRange = 10;  // x轴范围 [-5, 5]
    const yRange = 10;  // y轴范围 [-5, 5]
    
    // 当前函数和参数
    let currentFunction = 'sin';
    let translateX = 0.0;
    let translateY = 0.0;
    
    // 显示设置
    let showBase = true;
    let showReflectionX = false;
    let showReflectionY = false;
    let showReflectionOrigin = false;
    
    // 预设函数集合
    const functionMap = {
        sin: (x) => Math.sin(x),
        cos: (x) => Math.cos(x),
        quadratic: (x) => x * x
    };
    
    // 数学函数到LaTeX表达式的映射
    const latexMap = {
        sin: '\\sin(x)',
        cos: '\\cos(x)',
        quadratic: 'x^2'
    };
    
    // 函数颜色
    const colorMap = {
        base: p.color(65, 105, 225),         // 原函数 - 蓝色
        reflectionX: p.color(220, 20, 60),   // x轴反射 - 红色
        reflectionY: p.color(50, 205, 50),   // y轴反射 - 绿色
        reflectionOrigin: p.color(255, 165, 0) // 原点反射 - 橙色
    };
    
    // 坐标转换函数（数学坐标到画布坐标）
    const mapX = (x) => (x + xRange/2) * (width / xRange);
    const mapY = (y) => height - (y + yRange/2) * (height / yRange);
    
    // 反向映射（画布坐标到数学坐标）
    const unmapX = (px) => (px / width) * xRange - xRange/2;
    const unmapY = (py) => -((py / height) * yRange - yRange/2);
    
    // 设置函数
    p.setup = () => {
        // 创建画布
        const canvas = p.createCanvas(width, height);
        canvas.parent('composite-canvas');
        
        // 设置绘图属性
        p.stroke(0);
        p.strokeWeight(1);
        p.noFill();
        
        // 初始化事件监听
        setupEventListeners();
        
        // 首次绘制
        p.draw();
    };
    
    // 绘制函数
    p.draw = () => {
        // 清空画布
        p.background(255);
        
        // 绘制坐标系
        drawGrid();
        drawAxes();
        
        const func = functionMap[currentFunction];
        if (!func) return;
        
        // 绘制原始函数
        if (showBase) {
            drawTransformedFunction(func, false, false, colorMap.base);
        }
        
        // 绘制关于x轴的反射
        if (showReflectionX) {
            drawTransformedFunction(func, true, false, colorMap.reflectionX);
        }
        
        // 绘制关于y轴的反射
        if (showReflectionY) {
            drawTransformedFunction(func, false, true, colorMap.reflectionY);
        }
        
        // 绘制关于原点的反射
        if (showReflectionOrigin) {
            drawTransformedFunction(func, true, true, colorMap.reflectionOrigin);
        }
    };
    
    // 绘制网格
    function drawGrid() {
        p.stroke(230);
        p.strokeWeight(1);
        
        // 垂直网格线
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const px = mapX(x);
            p.line(px, 0, px, height);
        }
        
        // 水平网格线
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const py = mapY(y);
            p.line(0, py, width, py);
        }
    }
    
    // 绘制坐标轴
    function drawAxes() {
        p.stroke(0);
        p.strokeWeight(2);
        
        // x轴
        const yAxisPos = mapY(0);
        p.line(0, yAxisPos, width, yAxisPos);
        
        // y轴
        const xAxisPos = mapX(0);
        p.line(xAxisPos, 0, xAxisPos, height);
        
        // 坐标标记
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.fill(0);
        
        // x轴标记
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;
            const px = mapX(x);
            p.line(px, yAxisPos - 5, px, yAxisPos + 5);
            p.text(x, px, yAxisPos + 15);
        }
        
        // y轴标记
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;
            const py = mapY(y);
            p.line(xAxisPos - 5, py, xAxisPos + 5, py);
            p.text(y, xAxisPos - 15, py);
        }
        
        // 原点标记
        p.fill(0);
        p.noStroke();
        p.ellipse(xAxisPos, yAxisPos, 5, 5);
        p.text("O", xAxisPos - 10, yAxisPos + 10);
        
        // 坐标轴标签
        p.text("x", width - 10, yAxisPos - 10);
        p.text("y", xAxisPos + 10, 10);
    }
    
    // 绘制变换后的函数
    function drawTransformedFunction(func, reflectX, reflectY, color) {
        p.stroke(color);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        
        // 以小步长绘制函数曲线
        for (let px = 0; px <= width; px += 1) {
            let x = unmapX(px);
            
            // 应用反射和平移变换
            let transformedX = reflectY ? -x : x;
            transformedX = transformedX - translateX;
            
            try {
                let y = func(transformedX);
                
                // 应用y轴反射和平移
                y = reflectX ? -y : y;
                y = y + translateY;
                
                // 检查是否为有效值
                if (!isNaN(y) && isFinite(y) && Math.abs(y) <= yRange/2) {
                    p.vertex(px, mapY(y));
                } else {
                    // 对于不连续点，结束当前形状并开始新的形状
                    p.endShape();
                    p.beginShape();
                }
            } catch (e) {
                // 处理可能的错误
                p.endShape();
                p.beginShape();
            }
        }
        p.endShape();
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 预设函数选择
        document.querySelectorAll('.function-btn[data-target="composite"]').forEach(btn => {
            btn.addEventListener('click', function() {
                currentFunction = this.getAttribute('data-function');
                document.getElementById('composite-function-display').innerHTML = 
                    `\\(f(x) = ${latexMap[currentFunction]}\\)`;
                    
                if (window.MathJax) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }
                
                p.draw();
            });
        });
        
        // 显示设置
        document.getElementById('show-base').addEventListener('change', function() {
            showBase = this.checked;
            p.draw();
        });
        
        document.getElementById('show-reflection-x').addEventListener('change', function() {
            showReflectionX = this.checked;
            p.draw();
        });
        
        document.getElementById('show-reflection-y').addEventListener('change', function() {
            showReflectionY = this.checked;
            p.draw();
        });
        
        document.getElementById('show-reflection-origin').addEventListener('change', function() {
            showReflectionOrigin = this.checked;
            p.draw();
        });
        
        // 平移设置
        document.getElementById('composite-translate-x').addEventListener('input', function() {
            translateX = parseFloat(this.value);
            document.getElementById('composite-translate-x-display').textContent = translateX.toFixed(1);
            p.draw();
        });
        
        document.getElementById('composite-translate-y').addEventListener('input', function() {
            translateY = parseFloat(this.value);
            document.getElementById('composite-translate-y-display').textContent = translateY.toFixed(1);
            p.draw();
        });
    }
};

// 函数探索器p5实例
let explorerSketch = (p) => {
    // 画布大小
    const width = 600;
    const height = 500;
    
    // 坐标轴设置
    const xRange = 10;  // x轴范围 [-5, 5]
    const yRange = 10;  // y轴范围 [-5, 5]
    
    // 当前函数类型和参数
    let currentType = 'polynomial';
    let polynomialParams = { a: 0, b: 1, c: 0, d: 0 };
    let trigParams = { a: 1, b: 1, c: 0, d: 0 };
    let expParams = { a: 1, b: 2, c: 0, d: 0 };
    let logParams = { a: 1, b: 10, c: 0, d: 0 };
    
    // 坐标转换函数（数学坐标到画布坐标）
    const mapX = (x) => (x + xRange/2) * (width / xRange);
    const mapY = (y) => height - (y + yRange/2) * (height / yRange);
    
    // 反向映射（画布坐标到数学坐标）
    const unmapX = (px) => (px / width) * xRange - xRange/2;
    const unmapY = (py) => -((py / height) * yRange - yRange/2);
    
    // 设置函数
    p.setup = () => {
        // 创建画布
        const canvas = p.createCanvas(width, height);
        canvas.parent('explorer-canvas');
        
        // 设置绘图属性
        p.stroke(0);
        p.strokeWeight(1);
        p.noFill();
        
        // 初始化事件监听
        setupEventListeners();
        
        // 初始化显示
        updateFunctionFormula();
        
        // 首次绘制
        p.draw();
    };
    
    // 绘制函数
    p.draw = () => {
        // 清空画布
        p.background(255);
        
        // 绘制坐标系
        drawGrid();
        drawAxes();
        
        // 绘制当前函数
        p.stroke(65, 105, 225);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        
        // 以小步长绘制函数曲线
        for (let px = 0; px <= width; px += 1) {
            const x = unmapX(px);
            
            try {
                let y;
                
                switch (currentType) {
                    case 'polynomial':
                        y = polynomialParams.a * Math.pow(x, 3) + 
                            polynomialParams.b * Math.pow(x, 2) + 
                            polynomialParams.c * x + 
                            polynomialParams.d;
                        break;
                        
                    case 'trigonometric':
                        y = trigParams.a * Math.sin(trigParams.b * x + trigParams.c) + trigParams.d;
                        break;
                        
                    case 'exponential':
                        y = expParams.a * Math.pow(expParams.b, (x - expParams.c)) + expParams.d;
                        break;
                        
                    case 'logarithmic':
                        // 对于对数，需要确保参数x-c > 0
                        if (x - logParams.c <= 0) {
                            throw new Error("Logarithm of non-positive number");
                        }
                        y = logParams.a * (Math.log(x - logParams.c) / Math.log(logParams.b)) + logParams.d;
                        break;
                }
                
                // 检查是否为有效值
                if (!isNaN(y) && isFinite(y) && Math.abs(y) <= yRange/2) {
                    p.vertex(px, mapY(y));
                } else {
                    // 对于不连续点，结束当前形状并开始新的形状
                    p.endShape();
                    p.beginShape();
                }
            } catch (e) {
                // 处理可能的错误（如对数函数的负值输入）
                p.endShape();
                p.beginShape();
            }
        }
        p.endShape();
    };
    
    // 绘制网格
    function drawGrid() {
        p.stroke(230);
        p.strokeWeight(1);
        
        // 垂直网格线
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const px = mapX(x);
            p.line(px, 0, px, height);
        }
        
        // 水平网格线
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;  // 跳过原点，后面单独绘制坐标轴
            const py = mapY(y);
            p.line(0, py, width, py);
        }
    }
    
    // 绘制坐标轴
    function drawAxes() {
        p.stroke(0);
        p.strokeWeight(2);
        
        // x轴
        const yAxisPos = mapY(0);
        p.line(0, yAxisPos, width, yAxisPos);
        
        // y轴
        const xAxisPos = mapX(0);
        p.line(xAxisPos, 0, xAxisPos, height);
        
        // 坐标标记
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.fill(0);
        
        // x轴标记
        for (let x = -xRange/2; x <= xRange/2; x++) {
            if (x === 0) continue;
            const px = mapX(x);
            p.line(px, yAxisPos - 5, px, yAxisPos + 5);
            p.text(x, px, yAxisPos + 15);
        }
        
        // y轴标记
        for (let y = -yRange/2; y <= yRange/2; y++) {
            if (y === 0) continue;
            const py = mapY(y);
            p.line(xAxisPos - 5, py, xAxisPos + 5, py);
            p.text(y, xAxisPos - 15, py);
        }
        
        // 原点标记
        p.fill(0);
        p.noStroke();
        p.ellipse(xAxisPos, yAxisPos, 5, 5);
        p.text("O", xAxisPos - 10, yAxisPos + 10);
        
        // 坐标轴标签
        p.text("x", width - 10, yAxisPos - 10);
        p.text("y", xAxisPos + 10, 10);
    }
    
    // 更新函数表达式
    function updateFunctionFormula() {
        let latex;
        
        switch (currentType) {
            case 'polynomial':
                latex = `${polynomialParams.a.toFixed(1)}x^3 + ${polynomialParams.b.toFixed(1)}x^2`;
                if (polynomialParams.c !== 0) {
                    const sign = polynomialParams.c > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(polynomialParams.c).toFixed(1)}x`;
                }
                if (polynomialParams.d !== 0) {
                    const sign = polynomialParams.d > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(polynomialParams.d).toFixed(1)}`;
                }
                break;
                
            case 'trigonometric':
                latex = `${trigParams.a.toFixed(1)}\\sin(${trigParams.b.toFixed(1)}x`;
                if (trigParams.c !== 0) {
                    const sign = trigParams.c > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(trigParams.c).toFixed(1)}`;
                }
                latex += ')';
                if (trigParams.d !== 0) {
                    const sign = trigParams.d > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(trigParams.d).toFixed(1)}`;
                }
                break;
                
            case 'exponential':
                latex = `${expParams.a.toFixed(1)} \\cdot ${expParams.b.toFixed(1)}^{(x`;
                if (expParams.c !== 0) {
                    const sign = expParams.c > 0 ? '-' : '+';
                    latex += ` ${sign} ${Math.abs(expParams.c).toFixed(1)}`;
                }
                latex += ')}';
                if (expParams.d !== 0) {
                    const sign = expParams.d > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(expParams.d).toFixed(1)}`;
                }
                break;
                
            case 'logarithmic':
                latex = `${logParams.a.toFixed(1)} \\cdot \\log_{${logParams.b.toFixed(1)}}(x`;
                if (logParams.c !== 0) {
                    const sign = logParams.c > 0 ? '-' : '+';
                    latex += ` ${sign} ${Math.abs(logParams.c).toFixed(1)}`;
                }
                latex += ')';
                if (logParams.d !== 0) {
                    const sign = logParams.d > 0 ? '+' : '-';
                    latex += ` ${sign} ${Math.abs(logParams.d).toFixed(1)}`;
                }
                break;
        }
        
        document.getElementById('explorer-function-display').innerHTML = `\\(f(x) = ${latex}\\)`;
        
        // 重新渲染公式
        if (window.MathJax) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 函数类型选择
        document.getElementById('function-type').addEventListener('change', function() {
            currentType = this.value;
            updateFunctionFormula();
            p.draw();
        });
        
        // 多项式函数参数
        setupParamControl('poly-a', 'poly-a-display', val => {
            polynomialParams.a = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('poly-b', 'poly-b-display', val => {
            polynomialParams.b = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('poly-c', 'poly-c-display', val => {
            polynomialParams.c = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('poly-d', 'poly-d-display', val => {
            polynomialParams.d = val;
            updateFunctionFormula();
            p.draw();
        });
        
        // 三角函数参数
        setupParamControl('trig-a', 'trig-a-display', val => {
            trigParams.a = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('trig-b', 'trig-b-display', val => {
            trigParams.b = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('trig-c', 'trig-c-display', val => {
            trigParams.c = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('trig-d', 'trig-d-display', val => {
            trigParams.d = val;
            updateFunctionFormula();
            p.draw();
        });
        
        // 指数函数参数
        setupParamControl('exp-a', 'exp-a-display', val => {
            expParams.a = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('exp-b', 'exp-b-display', val => {
            expParams.b = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('exp-c', 'exp-c-display', val => {
            expParams.c = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('exp-d', 'exp-d-display', val => {
            expParams.d = val;
            updateFunctionFormula();
            p.draw();
        });
        
        // 对数函数参数
        setupParamControl('log-a', 'log-a-display', val => {
            logParams.a = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('log-b', 'log-b-display', val => {
            logParams.b = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('log-c', 'log-c-display', val => {
            logParams.c = val;
            updateFunctionFormula();
            p.draw();
        });
        
        setupParamControl('log-d', 'log-d-display', val => {
            logParams.d = val;
            updateFunctionFormula();
            p.draw();
        });
    }
    
    // 设置参数控制
    function setupParamControl(sliderId, displayId, callback) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);
        
        // 初始化显示
        display.textContent = parseFloat(slider.value).toFixed(1);
        
        // 添加事件监听
        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            display.textContent = value.toFixed(1);
            callback(value);
        });
    }
};

// 页面加载完成后初始化所有P5实例
document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化函数变换可视化实例');
    
    // 创建基本变换画布
    new p5(basicTransformSketch);
    
    // 创建复合变换画布
    new p5(compositeTransformSketch);
    
    // 创建函数探索器画布
    new p5(explorerSketch);
    
    console.log('所有函数变换可视化实例已初始化');
}); 