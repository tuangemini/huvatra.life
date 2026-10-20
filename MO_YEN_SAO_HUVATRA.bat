@echo off
chcp 65001 >nul
echo ========================================================
echo        KHỞI ĐỘNG WEBSITE YẾN SÀO HUVATRA
echo    164 Nguyễn Công Trứ, Bắc Cam Ranh, Khánh Hòa
echo    Hotline: 0974 002 626  ^|  Website: huvatra.life
echo ========================================================
echo.
echo Đang mở website trên trình duyệt mặc định...
start "" "http://localhost:8088"
if %errorlevel% neq 0 (
  start "" "index.html"
)
echo Hoàn tất!
timeout /t 3 >nul
exit
