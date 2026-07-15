Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Islamic App - Starting..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting API Server on port 3001..." -ForegroundColor Yellow
$apiJob = Start-Job -ScriptBlock {
  param($dir)
  Set-Location -LiteralPath $dir
  $env:NODE_ENV = "development"
  $env:PORT = "3001"
  node --enable-source-maps ./dist/index.mjs
} -ArgumentList "$ProjectRoot\artifacts\api-server"

Start-Sleep -Seconds 2

# Check API server
try {
  $r = Invoke-WebRequest -Uri "http://localhost:3001/api/healthz" -UseBasicParsing -TimeoutSec 3
  Write-Host "  API Server: OK (port 3001)" -ForegroundColor Green
} catch {
  Write-Host "  API Server: Failed to start!" -ForegroundColor Red
}

Write-Host ""
Write-Host "[2/2] Starting Expo (Mobile App)..." -ForegroundColor Yellow
Write-Host ""
Write-Host ">> افتح Expo Go على تلفونك وامسح ال QR code اللي هيظهر تحت" -ForegroundColor Cyan
Write-Host ">> التلفون لازم يكون على نفس شبكة WiFi بتاعت الكمبيوتر" -ForegroundColor Cyan
Write-Host ""

$env:EXPO_NO_TELEMETRY = "true"
$env:EXPO_NO_TYPESCRIPT_SETUP = "1"
Set-Location -LiteralPath "$ProjectRoot\artifacts\mobile"
node "$ProjectRoot\node_modules\expo\bin\cli" start

# Cleanup
Stop-Job $apiJob -ErrorAction SilentlyContinue
Remove-Job $apiJob -Force
