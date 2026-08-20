@echo off
title David Mobile - Setup
echo ==========================================
echo       DAVID MOBILE - FIRST TIME SETUP
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed.
  echo.
  echo Please install Node.js LTS from:
  echo https://nodejs.org/
  echo.
  echo After installing Node.js, close and reopen this file.
  pause
  exit /b 1
)

echo Node.js:
node -v
echo npm:
npm -v
echo.
echo Installing project dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo INSTALLATION FAILED.
  echo Please send a screenshot of this window.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo Setup completed successfully.
echo ==========================================
echo.
echo You can now run START-DAVID-MOBILE.bat
pause
