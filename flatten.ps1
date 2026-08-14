# youngkeke 프로젝트 평탄화 스크립트
# 실행 전 dev 서버 / VS Code 를 닫아 주세요.
$ErrorActionPreference = 'Stop'
Set-Location $env:USERPROFILE

$youngkk = 'C:\Users\KISIA\Desktop\youngkk'
$repo    = Join-Path $youngkk 'youngkeke-repo'
$proj    = Join-Path $repo 'Garuda Indonesia - Airline Flight Booking Website UI (Community)'
# 폴더명 대시(-) 자동 매칭 (일반 하이픈/엔대시 모두 대응)
if (!(Test-Path -LiteralPath $proj)) {
  $proj = (Get-ChildItem -LiteralPath $repo -Directory | Where-Object { $_.Name -like 'Garuda Indonesia*' } | Select-Object -First 1).FullName
}
$dest = 'C:\Users\KISIA\Desktop\youngkeke-air'

if (-not $proj -or !(Test-Path -LiteralPath $proj)) { throw "프로젝트 폴더를 못 찾음 (youngkeke-repo 안 Garuda...)" }
if (!(Test-Path -LiteralPath (Join-Path $repo '.git'))) { throw ".git 을 못 찾음: $repo" }
if (Test-Path -LiteralPath $dest) { throw "이미 존재함: $dest  (지우거나 이름 바꾼 뒤 다시 실행)" }

Write-Host "[1/4] 재설치 가능한 폴더 정리 (node_modules 등)..." -ForegroundColor Cyan
foreach ($j in @('node_modules','.pnpm-store','dist','_rmtest.txt')) {
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue -LiteralPath (Join-Path $proj $j)
}

Write-Host "[2/4] repo 루트의 중복 파일 제거..." -ForegroundColor Cyan
Remove-Item -Force -ErrorAction SilentlyContinue -LiteralPath (Join-Path $repo 'package-lock.json')
Remove-Item -Force -ErrorAction SilentlyContinue -LiteralPath (Join-Path $repo 'README.md')

Write-Host "[3/4] 프로젝트를 repo 루트(.git 위치)로 이동..." -ForegroundColor Cyan
Get-ChildItem -Force -LiteralPath $proj | Move-Item -Destination $repo -Force
Remove-Item -Recurse -Force -LiteralPath $proj

Write-Host "[4/4] 데스크톱으로 올리고 이름 변경 (youngkeke-air)..." -ForegroundColor Cyan
Move-Item -LiteralPath $repo -Destination $dest

Write-Host ""
Write-Host "완료  ->  $dest  (이 폴더 하나 = git repo = 프로젝트)" -ForegroundColor Green
Write-Host "다음: 새 폴더를 VS Code로 열고   npm install   그다음   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "확인 끝나면 옛 중복 폴더 삭제:" -ForegroundColor Yellow
Write-Host "   Remove-Item -Recurse -Force '$youngkk'" -ForegroundColor Yellow
