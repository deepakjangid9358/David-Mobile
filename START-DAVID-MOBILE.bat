@echo off
title David Mobile
echo ==========================================
echo          DAVID MOBILE - START
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Dependencies not found. Running setup...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting David Mobile...
echo.
echo Keep this window open while using the app.
echo The browser should open at the address shown below.
echo.
call npm run dev -- --host 0.0.0.0
pause
