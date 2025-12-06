@echo off
REM Windows version of brainrot script

REM Get screen resolution
for /f "tokens=1,2" %%a in ('wmic path Win32_VideoController get CurrentHorizontalResolution^,CurrentVerticalResolution /format:value ^| findstr "="') do (
    if "%%a"=="CurrentHorizontalResolution" set screen_width=%%b
    if "%%a"=="CurrentVerticalResolution" set screen_height=%%b
)

REM Calculate column width (1/4 of screen width)
set /a column_width=screen_width/4

REM URLs to open
set url1=https://www.tiktok.com/foryou
set url2=https://www.instagram.com/reels/
set url3=https://www.youtube.com/shorts
set url4=https://x.com/

REM Start Chrome windows in specific positions
REM Note: Chrome on Windows doesn't support exact positioning via command line like macOS
REM So we'll just open them in new windows side by side

start chrome --new-window --window-size=%column_width%,%screen_height% --window-position=0,0 "%url1%"
timeout /t 1 /nobreak >nul
start chrome --new-window --window-size=%column_width%,%screen_height% --window-position=%column_width%,0 "%url2%"
timeout /t 1 /nobreak >nul
set /a pos2=column_width*2
start chrome --new-window --window-size=%column_width%,%screen_height% --window-position=%pos2%,0 "%url3%"
timeout /t 1 /nobreak >nul
set /a pos3=column_width*3
start chrome --new-window --window-size=%column_width%,%screen_height% --window-position=%pos3%,0 "%url4%"