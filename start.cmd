@echo off
SETLOCAL
pushd %~dp0
call npm install --no-audit --no-fund
call npm run dev -- --host
popd
ENDLOCAL


