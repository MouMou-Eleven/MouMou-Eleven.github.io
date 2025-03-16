@echo off
echo 数学可视化平台 - 文件清理脚本
echo 此脚本将清理项目中的冗余文件，请确保已备份重要文件
echo.

timeout /t 5

echo 第1步: 创建备份目录
if not exist "backup" mkdir backup
if not exist "backup\css" mkdir backup\css
if not exist "backup\js" mkdir backup\js

echo.
echo 第2步: 备份将被删除的文件
if exist "index-old.html" copy "index-old.html" "backup\"
if exist "css\components.css" copy "css\components.css" "backup\css\"
if exist "css\common-experiment.css" copy "css\common-experiment.css" "backup\css\"
if exist "css\style.css" copy "css\style.css" "backup\css\"
if exist "css\README.md" copy "css\README.md" "backup\css\"

echo.
echo 第3步: 删除冗余文件
if exist "index-old.html" del "index-old.html"
if exist "css\components.css" del "css\components.css"
if exist "css\common-experiment.css" del "css\common-experiment.css"
if exist "css\style.css" del "css\style.css"
if exist "css\README.md" del "css\README.md"

echo.
echo 第4步: 准备删除simulations目录
echo 警告: 即将删除simulations目录，操作不可逆，请确认备份完成
echo 按任意键继续，或按Ctrl+C取消...
pause > nul

echo.
echo 第5步: 删除simulations目录
if exist "simulations" (
    rmdir /s /q "simulations"
    echo simulations目录已删除
) else (
    echo simulations目录不存在，跳过删除
)

echo.
echo 清理完成！项目结构已优化。
echo 请检查所有页面是否正常工作。
echo.

pause 