@echo off
cd /d "%~dp0"
if not exist node_modules call npm.cmd ci
if errorlevel 1 goto failed
if not exist .next\BUILD_ID call npm.cmd run build
if errorlevel 1 goto failed
echo Open http://127.0.0.1:3102 in your browser.
call npm.cmd run start -- --hostname 127.0.0.1 --port 3102
:failed
pause
