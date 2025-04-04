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

// 全局变量
let normalCanvas, binomialCanvas, poissonCanvas, uniformCanvas;
let normalCtx, binomialCtx, poissonCtx, uniformCtx;
let samples = [];
let diceResults = [];
let activeTab = 'normal-pane';

// 当页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('概率与统计页面加载完成');
    
    // 添加延迟确保DOM完全加载
    setTimeout(function() {
        try {
            // 初始化控件
            setupDistributionControls();
            setupSamplingControls();
            setupDiceControls();
            
            // 初始化画布
            initCanvases();
            
            console.log('所有初始化完成');
        } catch (error) {
            console.error('初始化过程中发生错误:', error);
        }
    }, 300);
});

// 设置分布控制
function setupDistributionControls() {
    debug('设置分布控制');
    
    // 正态分布参数监听
    const meanSlider = document.getElementById('mean');
    if (meanSlider) {
        meanSlider.addEventListener('input', function() {
            document.getElementById('mean-value').textContent = parseFloat(this.value).toFixed(1);
            updateNormalDistribution();
        });
    }
    
    const stdDevSlider = document.getElementById('std-dev');
    if (stdDevSlider) {
        stdDevSlider.addEventListener('input', function() {
            document.getElementById('std-dev-value').textContent = parseFloat(this.value).toFixed(1);
            updateNormalDistribution();
        });
    }
    
    const xValueSlider = document.getElementById('x-value');
    if (xValueSlider) {
        xValueSlider.addEventListener('input', function() {
            document.getElementById('x-value-display').textContent = parseFloat(this.value).toFixed(1);
            updateNormalDistribution();
        });
    }
    
    // 二项分布参数监听
    const trialsSlider = document.getElementById('trials');
    if (trialsSlider) {
        trialsSlider.addEventListener('input', function() {
            document.getElementById('trials-value').textContent = parseInt(this.value);
            updateBinomialDistribution();
            
            // 更新x值的最大值
            const binomialXSlider = document.getElementById('binomial-x-value');
            if (binomialXSlider) {
                binomialXSlider.max = parseInt(this.value);
                if (parseInt(binomialXSlider.value) > parseInt(this.value)) {
                    binomialXSlider.value = this.value;
                    document.getElementById('binomial-x-value-display').textContent = this.value;
                }
            }
        });
    }
    
    const probabilitySlider = document.getElementById('probability');
    if (probabilitySlider) {
        probabilitySlider.addEventListener('input', function() {
            document.getElementById('probability-value').textContent = parseFloat(this.value).toFixed(2);
            updateBinomialDistribution();
        });
    }
    
    const binomialXSlider = document.getElementById('binomial-x-value');
    if (binomialXSlider) {
        binomialXSlider.addEventListener('input', function() {
            document.getElementById('binomial-x-value-display').textContent = parseInt(this.value);
            updateBinomialDistribution();
        });
    }
    
    // 泊松分布参数监听
    const lambdaSlider = document.getElementById('lambda');
    if (lambdaSlider) {
        lambdaSlider.addEventListener('input', function() {
            document.getElementById('lambda-value').textContent = parseFloat(this.value).toFixed(1);
            updatePoissonDistribution();
            
            // 更新x值的合理范围
            const poissonXSlider = document.getElementById('poisson-x-value');
            if (poissonXSlider) {
                const lambda = parseFloat(this.value);
                poissonXSlider.max = Math.min(50, Math.max(15, Math.ceil(lambda * 2.5)));
                if (parseInt(poissonXSlider.value) > parseInt(poissonXSlider.max)) {
                    poissonXSlider.value = poissonXSlider.max;
                    document.getElementById('poisson-x-value-display').textContent = poissonXSlider.max;
                }
            }
        });
    }
    
    const poissonXSlider = document.getElementById('poisson-x-value');
    if (poissonXSlider) {
        poissonXSlider.addEventListener('input', function() {
            document.getElementById('poisson-x-value-display').textContent = parseInt(this.value);
            updatePoissonDistribution();
        });
    }
    
    // 均匀分布参数监听
    const minValueSlider = document.getElementById('min-value');
    if (minValueSlider) {
        minValueSlider.addEventListener('input', function() {
            const minValue = parseFloat(this.value);
            document.getElementById('min-value-display').textContent = minValue.toFixed(1);
            
            // 确保min < max
            const maxValueSlider = document.getElementById('max-value');
            const maxValue = parseFloat(maxValueSlider.value);
            if (minValue >= maxValue) {
                maxValueSlider.value = (minValue + 0.1).toFixed(1);
                document.getElementById('max-value-display').textContent = (minValue + 0.1).toFixed(1);
            }
            
            updateUniformDistribution();
        });
    }
    
    const maxValueSlider = document.getElementById('max-value');
    if (maxValueSlider) {
        maxValueSlider.addEventListener('input', function() {
            const maxValue = parseFloat(this.value);
            document.getElementById('max-value-display').textContent = maxValue.toFixed(1);
            
            // 确保max > min
            const minValueSlider = document.getElementById('min-value');
            const minValue = parseFloat(minValueSlider.value);
            if (maxValue <= minValue) {
                minValueSlider.value = (maxValue - 0.1).toFixed(1);
                document.getElementById('min-value-display').textContent = (maxValue - 0.1).toFixed(1);
            }
            
            updateUniformDistribution();
        });
    }
    
    const uniformXSlider = document.getElementById('uniform-x-value');
    if (uniformXSlider) {
        uniformXSlider.addEventListener('input', function() {
            document.getElementById('uniform-x-value-display').textContent = parseFloat(this.value).toFixed(1);
            updateUniformDistribution();
        });
    }
}

// 设置抽样控制
function setupSamplingControls() {
    debug('设置抽样控制');
    
    // 样本量滑块
    const sampleSizeSlider = document.getElementById('sample-size');
    if (sampleSizeSlider) {
        sampleSizeSlider.addEventListener('input', function() {
            document.getElementById('sample-size-value').textContent = parseInt(this.value);
        });
    }
    
    // 生成样本按钮
    const generateSamplesBtn = document.getElementById('generate-samples-btn');
    if (generateSamplesBtn) {
        generateSamplesBtn.addEventListener('click', function() {
            debug('生成样本');
            generateSamples();
        });
    }
}

// 设置骰子控制
function setupDiceControls() {
    debug('设置骰子控制');
    
    // 投掷骰子按钮
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    if (rollDiceBtn) {
        rollDiceBtn.addEventListener('click', function() {
            debug('投掷骰子');
            simulateDiceRolls();
        });
    }
}

// 初始化所有画布
function initCanvases() {
    console.log('开始初始化画布...');
    try {
        // 初始化正态分布画布
        initCanvasInContainer('normal-canvas-container', function(canvas) {
            normalCanvas = canvas;
            normalCtx = canvas.getContext('2d');
            updateNormalDistribution();
            console.log('正态分布画布初始化完成');
        });
        
        // 初始化二项分布画布
        initCanvasInContainer('binomial-canvas-container', function(canvas) {
            binomialCanvas = canvas;
            binomialCtx = canvas.getContext('2d');
            updateBinomialDistribution();
            console.log('二项分布画布初始化完成');
        });
        
        // 初始化泊松分布画布
        initCanvasInContainer('poisson-canvas-container', function(canvas) {
            poissonCanvas = canvas;
            poissonCtx = canvas.getContext('2d');
            updatePoissonDistribution();
            console.log('泊松分布画布初始化完成');
        });
        
        // 初始化均匀分布画布
        initCanvasInContainer('uniform-canvas-container', function(canvas) {
            uniformCanvas = canvas;
            uniformCtx = canvas.getContext('2d');
            updateUniformDistribution();
            console.log('均匀分布画布初始化完成');
        });
    } catch (error) {
        console.error('初始化画布时发生错误:', error);
    }
}

// 在指定容器内初始化画布
function initCanvasInContainer(containerId, callback) {
    console.log('初始化画布容器:', containerId);
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('找不到容器:', containerId);
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 创建画布
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = 500;
        canvas.style.display = 'block';
        container.appendChild(canvas);
        
        console.log(`画布创建成功，尺寸: ${canvas.width}x${canvas.height}`);
        
        if (callback) callback(canvas);
    } catch (error) {
        console.error('初始化画布容器时发生错误:', error);
    }
}

// 更新正态分布显示
function updateNormalDistribution() {
    if (!normalCanvas || !normalCtx) {
        console.error("正态分布画布未初始化");
        return;
    }
    
    console.log("正在更新正态分布...");
    
    const mean = parseFloat(document.getElementById('mean').value) || 0;
    const stdDev = parseFloat(document.getElementById('std-dev').value) || 1;
    const x = parseFloat(document.getElementById('x-value').value) || 0;
    
    // 清除画布
    normalCtx.clearRect(0, 0, normalCanvas.width, normalCanvas.height);
    
    // 绘制正态分布曲线
    drawNormalCurve(normalCtx, normalCanvas.width, normalCanvas.height, mean, stdDev, 'rgba(52, 152, 219, 0.8)');
    
    // 绘制正态累积分布函数
    drawNormalCdf(normalCtx, normalCanvas.width, normalCanvas.height, mean, stdDev, 'rgba(231, 76, 60, 0.7)');
    
    // 绘制x值处的概率密度
    drawPdfAtX(normalCtx, normalCanvas.width, normalCanvas.height, x, mean, stdDev);
    
    // 绘制坐标轴
    drawAxes(normalCtx, normalCanvas.width, normalCanvas.height);
    
    // 更新统计显示
    const pdfValue = normalPDF(x, mean, stdDev);
    const cdfValue = normalCDF(x, mean, stdDev);
    
    document.getElementById('normal-pdf-value').textContent = pdfValue.toFixed(4);
    document.getElementById('normal-cdf-value').textContent = cdfValue.toFixed(4);
    
    console.log("正态分布更新完成");
}

// 更新二项分布显示
function updateBinomialDistribution() {
    if (!binomialCanvas || !binomialCtx) {
        console.error("二项分布画布未初始化");
        return;
    }
    
    console.log("正在更新二项分布...");
    
    const n = parseInt(document.getElementById('trials').value) || 10;
    const p = parseFloat(document.getElementById('probability').value) || 0.5;
    const k = parseInt(document.getElementById('binomial-x-value').value) || 5;
    
    // 清除画布
    binomialCtx.clearRect(0, 0, binomialCanvas.width, binomialCanvas.height);
    
    // 绘制二项分布概率质量函数
    drawBinomialPmf(binomialCtx, binomialCanvas.width, binomialCanvas.height, n, p, 'rgba(52, 152, 219, 0.8)');
    
    // 绘制二项分布累积分布函数
    drawBinomialCdf(binomialCtx, binomialCanvas.width, binomialCanvas.height, n, p, 'rgba(231, 76, 60, 0.7)');
    
    // 绘制坐标轴
    drawAxes(binomialCtx, binomialCanvas.width, binomialCanvas.height);
    
    // 绘制k值处的概率质量
    highlightBinomialPmf(binomialCtx, binomialCanvas.width, binomialCanvas.height, n, p, k);
    
    // 更新统计显示
    const pmfValue = binomialPMF(n, k, p);
    let cdfValue = 0;
    for (let i = 0; i <= k; i++) {
        cdfValue += binomialPMF(n, i, p);
    }
    
    const expectedValue = n * p;
    const variance = n * p * (1 - p);
    
    document.getElementById('binomial-pmf-value').textContent = pmfValue.toFixed(4);
    document.getElementById('binomial-cdf-value').textContent = cdfValue.toFixed(4);
    document.getElementById('binomial-expected').textContent = expectedValue.toFixed(2);
    document.getElementById('binomial-variance').textContent = variance.toFixed(2);
    
    console.log("二项分布更新完成");
}

// 更新泊松分布显示
function updatePoissonDistribution() {
    if (!poissonCanvas || !poissonCtx) {
        console.error("泊松分布画布未初始化");
        return;
    }
    
    console.log("正在更新泊松分布...");
    
    const lambda = parseFloat(document.getElementById('lambda').value) || 3;
    const k = parseInt(document.getElementById('poisson-x-value').value) || 3;
    
    // 清除画布
    poissonCtx.clearRect(0, 0, poissonCanvas.width, poissonCanvas.height);
    
    // 绘制泊松分布概率质量函数
    drawPoissonPmf(poissonCtx, poissonCanvas.width, poissonCanvas.height, lambda, 'rgba(52, 152, 219, 0.8)');
    
    // 绘制泊松分布累积分布函数
    drawPoissonCdf(poissonCtx, poissonCanvas.width, poissonCanvas.height, lambda, 'rgba(231, 76, 60, 0.7)');
    
    // 绘制坐标轴
    drawAxes(poissonCtx, poissonCanvas.width, poissonCanvas.height);
    
    // 绘制k值处的概率质量
    highlightPoissonPmf(poissonCtx, poissonCanvas.width, poissonCanvas.height, lambda, k);
    
    // 更新统计显示
    const pmfValue = poissonPMF(lambda, k);
    let cdfValue = 0;
    for (let i = 0; i <= k; i++) {
        cdfValue += poissonPMF(lambda, i);
    }
    
    document.getElementById('poisson-pmf-value').textContent = pmfValue.toFixed(4);
    document.getElementById('poisson-cdf-value').textContent = cdfValue.toFixed(4);
    document.getElementById('poisson-expected').textContent = lambda.toFixed(2);
    document.getElementById('poisson-variance').textContent = lambda.toFixed(2);
    
    console.log("泊松分布更新完成");
}

// 更新均匀分布显示
function updateUniformDistribution() {
    if (!uniformCanvas || !uniformCtx) {
        console.error("均匀分布画布未初始化");
        return;
    }
    
    console.log("正在更新均匀分布...");
    
    const a = parseFloat(document.getElementById('min-value').value) || 0;
    const b = parseFloat(document.getElementById('max-value').value) || 1;
    const x = parseFloat(document.getElementById('uniform-x-value').value) || 0.5;
    
    // 清除画布
    uniformCtx.clearRect(0, 0, uniformCanvas.width, uniformCanvas.height);
    
    // 绘制均匀分布概率密度函数
    drawUniformPdf(uniformCtx, uniformCanvas.width, uniformCanvas.height, a, b, 'rgba(52, 152, 219, 0.8)');
    
    // 绘制均匀分布累积分布函数
    drawUniformCdf(uniformCtx, uniformCanvas.width, uniformCanvas.height, a, b, 'rgba(231, 76, 60, 0.7)');
    
    // 绘制坐标轴
    drawAxes(uniformCtx, uniformCanvas.width, uniformCanvas.height);
    
    // 绘制x值处的概率密度
    highlightUniformPdf(uniformCtx, uniformCanvas.width, uniformCanvas.height, a, b, x);
    
    // 更新统计显示
    let pdfValue = 0;
    let cdfValue = 0;
    
    if (x >= a && x <= b) {
        pdfValue = 1 / (b - a);
        cdfValue = (x - a) / (b - a);
    } else if (x > b) {
        cdfValue = 1;
    }
    
    const expectedValue = (a + b) / 2;
    const variance = Math.pow(b - a, 2) / 12;
    
    document.getElementById('uniform-pdf-value').textContent = pdfValue.toFixed(4);
    document.getElementById('uniform-cdf-value').textContent = cdfValue.toFixed(4);
    document.getElementById('uniform-expected').textContent = expectedValue.toFixed(4);
    document.getElementById('uniform-variance').textContent = variance.toFixed(4);
    
    console.log("均匀分布更新完成");
}

// 生成样本并更新显示
function generateSamples() {
    const mean = parseFloat(document.getElementById('mean').value) || 0;
    const stdDev = parseFloat(document.getElementById('std-dev').value) || 1;
    const sampleSize = parseInt(document.getElementById('sample-size').value) || 100;
    
    // 生成正态分布样本
    samples = [];
    for (let i = 0; i < sampleSize; i++) {
        samples.push(generateNormalRandom(mean, stdDev));
    }
    
    // 绘制样本直方图并计算统计量
    if (normalCanvas && normalCtx) {
        // 清除画布
        normalCtx.clearRect(0, 0, normalCanvas.width, normalCanvas.height);
        
        // 绘制直方图
        drawHistogram(normalCtx, samples, normalCanvas.width, normalCanvas.height, 'rgba(52, 152, 219, 0.6)', Math.min(...samples), Math.max(...samples));
        
        // 绘制理论正态分布曲线
        drawNormalCurve(normalCtx, normalCanvas.width, normalCanvas.height, mean, stdDev, 'rgba(231, 76, 60, 0.7)');
        
        // 绘制坐标轴
        drawAxes(normalCtx, normalCanvas.width, normalCanvas.height);
        
        // 计算样本统计量
        const sampleMean = calculateMean(samples);
        const sampleStd = calculateStandardDeviation(samples);
        
        // 更新样本统计量显示
        updateSamplingStatistics(samples, {mean, stdDev}, sampleSize);
    }
}

// 执行骰子模拟
function simulateDiceRolls() {
    const numDice = parseInt(document.getElementById('trials').value) || 1;
    const numTrials = parseInt(document.getElementById('sample-size').value) || 100;
    
    // 生成骰子点数和
    const results = simulateDiceRolls(numDice, numTrials);
    
    // 更新显示
    if (binomialCanvas && binomialCtx) {
        // 清除画布
        binomialCtx.clearRect(0, 0, binomialCanvas.width, binomialCanvas.height);
        
        // 绘制直方图
        drawHistogram(binomialCtx, results, binomialCanvas.width, binomialCanvas.height, 'rgba(52, 152, 219, 0.6)', 
                     numDice, numDice * 6);
        
        // 绘制坐标轴
        drawAxes(binomialCtx, binomialCanvas.width, binomialCanvas.height);
        
        // 更新骰子统计量显示
        updateDiceStatistics(results, numDice);
    }
}

// 绘制正态分布曲线(PDF)
function drawNormalCurve(ctx, width, height, mean, std, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const scale = std * 50;
    const baseY = height - 50;
    const centerX = width / 2 + mean * 50;
    
    for(let x = 50; x < width - 50; x++) {
        const xPos = (x - centerX) / scale;
        const y = baseY - 150 * normalPDF(xPos, 0, 1);
        
        if(x === 50) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 添加标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PDF', 60, 40);
}

// 绘制正态分布累积分布函数(CDF)
function drawNormalCdf(ctx, width, height, mean, std, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const scale = std * 50;
    const baseY = height - 50;
    const centerX = width / 2 + mean * 50;
    
    // 累积分布函数
    for(let x = 50; x < width - 50; x++) {
        const xPos = (x - centerX) / scale;
        const probability = normalCDF(xPos);
        const y = baseY - 300 * probability;
        
        if(x === 50) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 添加标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CDF', 60, 70);
}

// 绘制二项分布概率质量函数(PMF)
function drawBinomialPmf(ctx, width, height, n, p, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const barWidth = (width - 100) / (n + 1);
    const baseY = height - 50;
    
    // 找到最大概率以缩放图形
    let maxProb = 0;
    for(let k = 0; k <= n; k++) {
        const prob = binomialPMF(n, k, p);
        if(prob > maxProb) maxProb = prob;
    }
    
    const scale = 200 / maxProb;
    
    // 绘制PMF
    for(let k = 0; k <= n; k++) {
        const prob = binomialPMF(n, k, p);
        const barHeight = prob * scale;
        
        const x = 50 + k * barWidth;
        const y = baseY - barHeight;
        
        ctx.fillStyle = color + '40'; // 半透明
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, barWidth - 2, barHeight);
        
        // 添加标签
        if(n <= 20) {
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(k.toString(), x + barWidth / 2, baseY + 15);
        }
    }
    
    // 添加PMF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PMF', 60, 40);
}

// 绘制二项分布累积分布函数(CDF)
function drawBinomialCdf(ctx, width, height, n, p, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const barWidth = (width - 100) / (n + 1);
    const baseY = height - 50;
    
    // 计算CDF
    let cumulativeProb = 0;
    
    for(let k = 0; k <= n; k++) {
        cumulativeProb += binomialPMF(n, k, p);
        const barHeight = cumulativeProb * 200;
        
        const x = 50 + k * barWidth + barWidth / 2;
        const y = baseY - barHeight;
        
        if(k === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 添加CDF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CDF', 60, 70);
}

// 绘制泊松分布概率质量函数(PMF)
function drawPoissonPmf(ctx, width, height, lambda, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const maxX = Math.min(Math.ceil(lambda * 3), 30); // 显示最多30个点
    const barWidth = (width - 100) / (maxX + 1);
    const baseY = height - 50;
    
    // 找到最大概率以缩放图形
    let maxProb = 0;
    for(let k = 0; k <= maxX; k++) {
        const prob = poissonPMF(lambda, k);
        if(prob > maxProb) maxProb = prob;
    }
    
    const scale = 200 / maxProb;
    
    // 绘制PMF
    for(let k = 0; k <= maxX; k++) {
        const prob = poissonPMF(lambda, k);
        const barHeight = prob * scale;
        
        const x = 50 + k * barWidth;
        const y = baseY - barHeight;
        
        ctx.fillStyle = color + '40'; // 半透明
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, barWidth - 2, barHeight);
        
        // 添加标签
        if(maxX <= 20) {
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(k.toString(), x + barWidth / 2, baseY + 15);
        }
    }
    
    // 添加PMF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PMF', 60, 40);
}

// 绘制泊松分布累积分布函数(CDF)
function drawPoissonCdf(ctx, width, height, lambda, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const maxX = Math.min(Math.ceil(lambda * 3), 30);
    const barWidth = (width - 100) / (maxX + 1);
    const baseY = height - 50;
    
    // 计算CDF
    let cumulativeProb = 0;
    
    for(let k = 0; k <= maxX; k++) {
        cumulativeProb += poissonPMF(lambda, k);
        const barHeight = cumulativeProb * 200;
        
        const x = 50 + k * barWidth + barWidth / 2;
        const y = baseY - barHeight;
        
        if(k === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 添加CDF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CDF', 60, 70);
}

// 绘制均匀分布概率密度函数(PDF)
function drawUniformPdf(ctx, width, height, a, b, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const baseY = height - 50;
    const scale = 50; // 每个单位的像素数
    
    // 转换参数到画布坐标
    const x1 = width / 2 + a * scale;
    const x2 = width / 2 + b * scale;
    
    // 计算均匀分布的高度(PDF值)
    const pdfValue = 1 / (b - a);
    const pdfHeight = pdfValue * 150;
    
    // 绘制PDF
    ctx.beginPath();
    // 在a之前为0
    ctx.moveTo(50, baseY);
    ctx.lineTo(x1, baseY);
    // 从a到b为常数
    ctx.lineTo(x1, baseY - pdfHeight);
    ctx.lineTo(x2, baseY - pdfHeight);
    // 在b之后为0
    ctx.lineTo(x2, baseY);
    ctx.lineTo(width - 50, baseY);
    
    ctx.stroke();
    
    // 填充区域
    ctx.fillStyle = color + '40'; // 半透明
    ctx.fill();
    
    // 添加PDF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PDF', 60, 40);
}

// 绘制均匀分布累积分布函数(CDF)
function drawUniformCdf(ctx, width, height, a, b, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const baseY = height - 50;
    const scale = 50; // 每个单位的像素数
    
    // 转换参数到画布坐标
    const x1 = width / 2 + a * scale;
    const x2 = width / 2 + b * scale;
    
    // 绘制CDF
    ctx.beginPath();
    // 在a之前为0
    ctx.moveTo(50, baseY);
    ctx.lineTo(x1, baseY);
    // 从a到b线性增长
    ctx.lineTo(x1, baseY);
    ctx.lineTo(x2, baseY - 200); // 高度200表示概率为1
    // 在b之后为1
    ctx.lineTo(width - 50, baseY - 200);
    
    ctx.stroke();
    
    // 添加CDF标签
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CDF', 60, 70);
}

// 绘制坐标轴
function drawAxes(ctx, width, height) {
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    
    // x轴
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.stroke();
    
    // y轴
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, height - 50);
    ctx.stroke();
    
    // 添加标签
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('x', width - 30, height - 50);
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('y', 45, 40);
}

// 绘制柱状图
function drawHistogram(ctx, data, width, height, color, min, max) {
    const barWidth = (width - 100) / (max - min + 1);
    const maxCount = Math.max(...Object.values(data));
    const scale = (height - 100) / maxCount;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // 绘制柱状图
    for(let i = min; i <= max; i++) {
        const x = 50 + (i - min) * barWidth;
        const barHeight = (data[i] || 0) * scale;
        
        ctx.fillStyle = color + '40'; // 添加透明度
        ctx.fillRect(x, height - 50 - barHeight, barWidth - 2, barHeight);
        
        ctx.strokeStyle = color;
        ctx.strokeRect(x, height - 50 - barHeight, barWidth - 2, barHeight);
        
        // 添加标签
        if((max - min) < 15) { // 只在数据点少时显示标签
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.textBaseline = 'top';
            ctx.fillText(i.toString(), x + barWidth/2, height - 40);
        }
    }
}

// 绘制总体分布
function drawPopulationDistribution(ctx, width, height, distribution) {
    switch(distribution) {
        case 'normal':
            // 绘制正态分布
            ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.beginPath();
            
            const centerX = width / 2;
            const baseY = height - 100;
            
            for(let x = 50; x < width - 50; x++) {
                const xPos = (x - centerX) / 50;
                const y = baseY - 100 * normalPDF(xPos, 0, 1);
                
                if(x === 50) {
                    ctx.moveTo(x, baseY);
                    ctx.lineTo(x, y);
                } else if (x === width - 51) {
                    ctx.lineTo(x, y);
                    ctx.lineTo(x, baseY);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            break;
            
        case 'uniform':
            // 绘制均匀分布
            ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.fillRect(width / 2 - 100, height - 150, 200, 50);
            break;
            
        case 'exponential':
            // 绘制指数分布
            ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.beginPath();
            
            const startX = width / 2;
            const startY = height - 100;
            
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, startY - 150);
            
            for(let x = startX; x < width - 50; x++) {
                const dist = (x - startX) / 50;
                const y = startY - 150 * Math.exp(-dist);
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(width - 50, startY);
            ctx.closePath();
            ctx.fill();
            break;
    }
}

// 绘制样本均值分布
function drawSampleMeansDistribution(ctx, width, height, sampleMeans) {
    if(!sampleMeans || sampleMeans.length === 0) {
        debug('错误: 无样本均值数据');
        return;
    }
    
    // 计算样本均值的范围
    let min = Math.min(...sampleMeans);
    let max = Math.max(...sampleMeans);
    
    // 扩展一点范围以便更好地显示
    const range = max - min;
    min = min - range * 0.1;
    max = max + range * 0.1;
    
    // 分箱
    const numBins = Math.min(Math.ceil(Math.sqrt(sampleMeans.length)), 30);
    const bins = {};
    const binWidth = (max - min) / numBins;
    
    for(let i = 0; i < numBins; i++) {
        bins[i] = 0;
    }
    
    // 计算每个区间的频数
    sampleMeans.forEach(mean => {
        const binIndex = Math.floor((mean - min) / binWidth);
        if(binIndex >= 0 && binIndex < numBins) {
            bins[binIndex] = (bins[binIndex] || 0) + 1;
        }
    });
    
    // 绘制直方图
    const barWidth = (width - 150) / numBins;
    const maxCount = Math.max(...Object.values(bins));
    const scale = (height - 150) / maxCount;
    
    ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1;
    
    for(let i = 0; i < numBins; i++) {
        const x = 75 + i * barWidth;
        const barHeight = bins[i] * scale;
        
        ctx.fillRect(x, height - 100 - barHeight, barWidth - 1, barHeight);
        ctx.strokeRect(x, height - 100 - barHeight, barWidth - 1, barHeight);
    }
    
    // 添加标签
    ctx.fillStyle = '#e74c3c';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('样本均值分布', 80, 70);
}

// 生成样本均值
function generateSampleMeans(distribution, sampleSize, numSamples) {
    const sampleMeans = [];
    
    for(let i = 0; i < numSamples; i++) {
        const sample = generateSample(distribution, sampleSize);
        const mean = calculateMean(sample);
        sampleMeans.push(mean);
    }
    
    return sampleMeans;
}

// 生成指定分布的样本
function generateSample(distribution, size) {
    const sample = [];
    
    for(let i = 0; i < size; i++) {
        let value;
        
        switch(distribution) {
            case 'normal':
                // 使用Box-Muller变换生成正态分布随机数
                value = generateNormalRandom(0, 1);
                break;
            case 'uniform':
                // 生成[-3, 3]范围内的均匀分布随机数
                value = Math.random() * 6 - 3;
                break;
            case 'exponential':
                // 生成λ=1的指数分布随机数
                value = -Math.log(Math.random());
                break;
            default:
                value = Math.random();
        }
        
        sample.push(value);
    }
    
    return sample;
}

// 计算样本均值
function calculateMean(sample) {
    if(!sample || sample.length === 0) return 0;
    const sum = sample.reduce((a, b) => a + b, 0);
    return sum / sample.length;
}

// 计算样本标准差
function calculateStandardDeviation(sample) {
    if(!sample || sample.length <= 1) return 0;
    
    const mean = calculateMean(sample);
    const squaredDiffs = sample.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (sample.length - 1);
    
    return Math.sqrt(variance);
}

// 更新分布统计值显示
function updateStatisticsDisplay(distType, params) {
    const statsDiv = document.getElementById('distribution-stats');
    if(!statsDiv) return;
    
    let statsHtml = '<h3>分布参数</h3><ul>';
    
    switch(distType) {
        case 'normal':
            const mean = params.mean;
            const std = params.std;
            
            statsHtml += `<li>均值 (μ): ${mean.toFixed(2)}</li>`;
            statsHtml += `<li>标准差 (σ): ${std.toFixed(2)}</li>`;
            statsHtml += `<li>方差 (σ²): ${(std * std).toFixed(2)}</li>`;
            break;
            
        case 'binomial':
            const n = params.n;
            const p = params.p;
            const binomialMean = n * p;
            const binomialVar = n * p * (1 - p);
            
            statsHtml += `<li>试验次数 (n): ${n}</li>`;
            statsHtml += `<li>成功概率 (p): ${p.toFixed(2)}</li>`;
            statsHtml += `<li>均值 (np): ${binomialMean.toFixed(2)}</li>`;
            statsHtml += `<li>方差 (np(1-p)): ${binomialVar.toFixed(2)}</li>`;
            break;
            
        case 'poisson':
            const lambda = params.lambda;
            
            statsHtml += `<li>强度参数 (λ): ${lambda.toFixed(2)}</li>`;
            statsHtml += `<li>均值 (λ): ${lambda.toFixed(2)}</li>`;
            statsHtml += `<li>方差 (λ): ${lambda.toFixed(2)}</li>`;
            break;
            
        case 'uniform':
            const a = params.a;
            const b = params.b;
            const uniformMean = (a + b) / 2;
            const uniformVar = Math.pow(b - a, 2) / 12;
            
            statsHtml += `<li>下限 (a): ${a.toFixed(2)}</li>`;
            statsHtml += `<li>上限 (b): ${b.toFixed(2)}</li>`;
            statsHtml += `<li>均值 ((a+b)/2): ${uniformMean.toFixed(2)}</li>`;
            statsHtml += `<li>方差 ((b-a)²/12): ${uniformVar.toFixed(2)}</li>`;
            break;
    }
    
    statsHtml += '</ul>';
    statsDiv.innerHTML = statsHtml;
}

// 更新抽样统计量显示
function updateSamplingStatistics(sampleMeans, distribution, sampleSize) {
    const statsDiv = document.getElementById('sampling-stats');
    if(!statsDiv || !sampleMeans || sampleMeans.length === 0) return;
    
    // 计算样本均值的均值和标准差
    const meanOfMeans = calculateMean(sampleMeans);
    const stdOfMeans = calculateStandardDeviation(sampleMeans);
    
    // 理论标准误
    let theoreticalStdError = 0;
    switch(distribution) {
        case 'normal':
            theoreticalStdError = 1 / Math.sqrt(sampleSize);
            break;
        case 'uniform':
            // 均匀分布[-3,3]的方差为3
            theoreticalStdError = Math.sqrt(3) / Math.sqrt(sampleSize);
            break;
        case 'exponential':
            // 指数分布λ=1的方差为1
            theoreticalStdError = 1 / Math.sqrt(sampleSize);
            break;
    }
    
    let statsHtml = '<h3>抽样统计量</h3><ul>';
    statsHtml += `<li>样本数量: ${sampleMeans.length}</li>`;
    statsHtml += `<li>样本大小: ${sampleSize}</li>`;
    statsHtml += `<li>均值的均值: ${meanOfMeans.toFixed(4)}</li>`;
    statsHtml += `<li>均值的标准差: ${stdOfMeans.toFixed(4)}</li>`;
    statsHtml += `<li>理论标准误: ${theoreticalStdError.toFixed(4)}</li>`;
    statsHtml += '</ul>';
    
    statsDiv.innerHTML = statsHtml;
}

// 更新骰子统计量显示
function updateDiceStatistics(diceResults, numDice) {
    const statsDiv = document.getElementById('dice-stats');
    if(!statsDiv || !diceResults) return;
    
    // 计算总次数
    const totalRolls = Object.values(diceResults).reduce((a, b) => a + b, 0);
    if(totalRolls === 0) return;
    
    // 计算实际均值和理论均值
    let sum = 0;
    for(let i = numDice; i <= numDice * 6; i++) {
        sum += i * (diceResults[i] || 0);
    }
    const actualMean = sum / totalRolls;
    const theoreticalMean = numDice * 3.5;
    
    // 计算实际方差和理论方差
    let sumSquaredDiff = 0;
    for(let i = numDice; i <= numDice * 6; i++) {
        sumSquaredDiff += Math.pow(i - actualMean, 2) * (diceResults[i] || 0);
    }
    const actualVariance = sumSquaredDiff / totalRolls;
    const theoreticalVariance = numDice * (35/12);
    
    let statsHtml = '<h3>骰子统计量</h3><ul>';
    statsHtml += `<li>投掷总次数: ${totalRolls}</li>`;
    statsHtml += `<li>骰子数量: ${numDice}</li>`;
    statsHtml += `<li>实际均值: ${actualMean.toFixed(2)}</li>`;
    statsHtml += `<li>理论均值: ${theoreticalMean.toFixed(2)}</li>`;
    statsHtml += `<li>实际方差: ${actualVariance.toFixed(2)}</li>`;
    statsHtml += `<li>理论方差: ${theoreticalVariance.toFixed(2)}</li>`;
    statsHtml += '</ul>';
    
    let frequencyHtml = '<h4>频率统计</h4><ul>';
    for(let i = numDice; i <= numDice * 6; i++) {
        const count = diceResults[i] || 0;
        const probability = count / totalRolls;
        frequencyHtml += `<li>${i}: ${count} (${(probability * 100).toFixed(1)}%)</li>`;
    }
    frequencyHtml += '</ul>';
    
    statsDiv.innerHTML = statsHtml + frequencyHtml;
}

// 模拟骰子投掷
function simulateDiceRolls(numDice, numTrials) {
    const results = {};
    
    for(let i = 0; i < numTrials; i++) {
        let sum = 0;
        for(let j = 0; j < numDice; j++) {
            // 生成1到6的随机整数
            sum += Math.floor(Math.random() * 6) + 1;
        }
        
        results[sum] = (results[sum] || 0) + 1;
    }
    
    return results;
}

// 正态分布概率密度函数(PDF)
function normalPDF(x, mean = 0, std = 1) {
    return Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
}

// 正态分布累积分布函数(CDF)近似
function normalCDF(x, mean = 0, std = 1) {
    // 标准化变量
    const z = (x - mean) / std;
    
    // 使用近似公式计算标准正态CDF
    if (z < -6) return 0;
    if (z > 6) return 1;
    
    let sum = 0;
    let term = z;
    let i = 3;
    
    while (Math.abs(term) > 1e-10) {
        sum += term;
        term = term * z * z / i;
        i += 2;
    }
    
    return 0.5 + sum * 0.3989422804014327; // 0.3989... = 1/sqrt(2*PI)
}

// 二项分布概率质量函数(PMF)
function binomialPMF(n, k, p) {
    if (k < 0 || k > n || !Number.isInteger(k)) return 0;
    
    // 计算组合数 C(n,k)
    let coef = 1;
    for (let i = 1; i <= k; i++) {
        coef *= (n - (k - i)) / i;
    }
    
    return coef * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// 泊松分布概率质量函数(PMF)
function poissonPMF(lambda, k) {
    if(k < 0 || !Number.isInteger(k)) return 0;
    
    // 计算泊松分布概率
    let denominator = 1;
    for(let i = 2; i <= k; i++) {
        denominator *= i;
    }
    
    return Math.pow(lambda, k) * Math.exp(-lambda) / denominator;
}

// 生成正态分布随机数（使用Box-Muller变换）
function generateNormalRandom(mean = 0, std = 1) {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return mean + std * z;
}
