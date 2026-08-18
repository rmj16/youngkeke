@echo off
setlocal EnableExtensions
set "ADMIN_HOST=admin.airlab.test"
set "ADMIN_URL=http://%ADMIN_HOST%:5173"
set "HOSTS_FILE=%SystemRoot%\System32\drivers\etc\hosts"

fltmc >nul 2>&1
if errorlevel 1 (
  echo [YOUNGKEKE AIR] Requesting administrator permission...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath $env:ComSpec -ArgumentList '/d /c ""%~f0""' -Verb RunAs"
  exit /b
)

echo [1/4] Checking the admin domain...
findstr /I /C:"127.0.0.1 %ADMIN_HOST%" "%HOSTS_FILE%" >nul 2>&1
if errorlevel 1 (
  >>"%HOSTS_FILE%" echo 127.0.0.1 %ADMIN_HOST%
  if errorlevel 1 (
    echo [ERROR] Could not update the Windows hosts file.
    pause
    exit /b 1
  )
  echo       Registered %ADMIN_HOST%.
) else (
  echo       The domain is already registered.
)

echo [2/4] Refreshing the DNS cache...
ipconfig /flushdns >nul 2>&1

cd /d "%~dp0"
where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js or npm.cmd was not found.
  pause
  exit /b 1
)

echo [3/4] Preparing the browser...
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process '%ADMIN_URL%'"

echo [4/4] Starting the YOUNGKEKE AIR admin website...
echo       URL: %ADMIN_URL%
echo       Stop: Ctrl+C
echo.
call npm.cmd run dev

if errorlevel 1 (
  echo.
  echo [ERROR] The development server did not start correctly.
  pause
)

endlocal
