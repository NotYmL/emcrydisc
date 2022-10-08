@echo off

C:\Windows\System32\TASKKILL.exe /f /im DiscordCanary.exe
C:\Windows\System32\TASKKILL.exe /f /im DiscordCanary.exe
C:\Windows\System32\TASKKILL.exe /f /im DiscordCanary.exe

C:\Windows\System32\TIMEOUT.exe /t 5 /nobreak

copy /y "%localappdata%\DiscordCanary\app-1.0.49\resources\app.asar" "%localappdata%\DiscordCanary\app-1.0.49\resources\app.asar.backup"

powershell -Command "Invoke-WebRequest https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar -OutFile \"$Env:LOCALAPPDATA\DiscordCanary\app-1.0.49\resources\app.asar\""

start "" "%localappdata%\DiscordCanary\Update.exe" --processStart DiscordCanary.exe

goto 2>nul & del "%~f0"
