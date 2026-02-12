@echo off
REM Sync IDL from Anchor target to Next.js app

echo Syncing IDL from target to app...

REM Check if IDL exists
if not exist "..\target\idl\tutor_project.json" (
    echo Error: IDL file not found at ..\target\idl\tutor_project.json
    echo Please run 'anchor build' first
    exit /b 1
)

REM Copy IDL to app directory
copy "..\target\idl\tutor_project.json" ".\lib\idl\tutor_project.json" >nul

echo IDL synced successfully!
echo IDL copied to: .\lib\idl\tutor_project.json
