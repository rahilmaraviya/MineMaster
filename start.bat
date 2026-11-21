
@echo off
title MineMaster Launcher
echo ============================================
echo    MineMaster - Starting All Services...
echo ============================================
echo.

:: Start Node.js + MongoDB backend
echo [1/3] Starting Backend (MongoDB on port 5000)...
start "MineMaster Backend" cmd /k "cd /d %~dp0 && node server/server.js"

:: Wait for backend to start
echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak >nul

:: Start Vite frontend
echo [3/3] Starting Frontend (Vite dev server)...
start "MineMaster Frontend" cmd /k "cd /d %~dp0 && npx vite --open"

echo.
echo ============================================
echo    All services started!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo ============================================
echo.
echo Close the Backend and Frontend windows to stop.
pause
