@echo off
title MineMaster Launcher
echo ============================================
echo    MineMaster - Starting All Services...
echo ============================================
echo.

:: Start json-server backend in a new window
echo [1/3] Starting Backend (json-server on port 3001)...
start "MineMaster Backend" cmd /k "cd /d %~dp0 && npx json-server --watch db.json --port 3001"

:: Wait for backend to be ready
echo [2/3] Waiting for backend to start...
timeout /t 3 /nobreak >nul

:: Start Vite frontend in a new window
echo [3/3] Starting Frontend (Vite dev server)...
start "MineMaster Frontend" cmd /k "cd /d %~dp0 && npx vite --open"

echo.
echo ============================================
echo    All services started!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo ============================================
echo.
echo Close this window anytime. To stop servers,
echo close the Backend and Frontend windows.
pause
