@echo off
echo 数学可视化平台 - 样式更新脚本
echo 此脚本将在模拟实验页面中添加简洁主题的引用
echo.

timeout /t 5

echo 创建备份目录
if not exist "backup\模拟实验" mkdir backup\模拟实验

echo.
echo 准备添加适配器脚本到各实验页面
echo 这将允许新旧组件共存，逐步迁移到新样式
echo.

set modules=三角函数 函数变换 向量运算 导数切线 积分计算

for %%m in (%modules%) do (
    echo 处理 %%m 模块...
    
    if exist "模拟实验\%%m\index.html" (
        echo   备份 %%m\index.html
        if not exist "backup\模拟实验\%%m" mkdir backup\模拟实验\%%m
        copy "模拟实验\%%m\index.html" "backup\模拟实验\%%m\"
        
        echo   添加适配器到 %%m\index.html
        echo ^<!-- 添加主题适配器 --^> >> "模拟实验\%%m\index.html"
        echo ^<script src="../../js/clean-theme-adapter.js"^>^</script^> >> "模拟实验\%%m\index.html"
    ) else (
        echo   %%m\index.html 不存在，跳过
    )
    
    echo.
)

echo.
echo 更新完成！
echo 现在您可以逐步将页面中的组件迁移到新样式。
echo 适配器将自动将旧组件转换为新组件的样式。
echo.

pause 