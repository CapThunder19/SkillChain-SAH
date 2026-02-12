@echo off
echo ===========================================
echo   🎓 AI Tutor - Starting Development
echo ===========================================
echo.

:: Check if validator is running
wsl bash -c "pgrep solana-test-validator > /dev/null"
if %errorlevel% neq 0 (
    echo Starting Solana Test Validator...
    start "Solana Validator" wsl bash -ilc "cd /mnt/d/code2/sah/tutor_project && solana-test-validator --reset"
    echo Waiting for validator to start...
    timeout /t 5 /nobreak > nul
) else (
    echo ✓ Validator already running
)

echo.
echo Starting Next.js Development Server...
cd app
start "Next.js Dev Server" cmd /k "npm run dev"

echo.
echo ===========================================
echo   ✅ Setup Complete!
echo ===========================================
echo.
echo   Frontend: http://localhost:3000
echo.
echo   Press any key to open browser...
pause > nul

start http://localhost:3000
