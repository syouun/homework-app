@echo off
setlocal
title Homework Adventure Launcher

echo ==================================================
echo   HOMEWORK ADVENTURE LAUNCHER (Local DB)
echo ==================================================

cd /d "%~dp0"

REM 1. Check Database Connection
echo.
echo [1/3] Checking Database Connection...
set PGPASSWORD=password
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost -c "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Cannot connect to local PostgreSQL database.
    echo Please ensure PostgreSQL service is running.
    echo.
    echo Detailed check:
    "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost -c "SELECT 1"
    pause
    exit /b
) else (
    echo [OK] Database is ready.
)

REM 2. Schema Sync
echo.
echo [2/3] Verifying Database Schema...
call npx prisma db push

REM 3. Start Next.js
echo.
echo [3/3] Starting Game Server...
echo.
echo Please open your browser to: http://localhost:3000
echo (Press Ctrl+C to stop the server)
echo.

start http://localhost:3000
call npm run dev

pause
