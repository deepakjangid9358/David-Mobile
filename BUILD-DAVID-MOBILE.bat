@echo off
title David Mobile - Production Build
echo Building production version...
call npm install
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)
call npm run build
if errorlevel 1 (
  echo.
  echo BUILD FAILED. Send this window's screenshot.
  pause
  exit /b 1
)
echo.
echo Production build completed.
echo The output is in the dist folder.
pause
