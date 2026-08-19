[CmdletBinding()]
param(
    [ValidateSet('PC2-HOST', 'WIN-01')]
    [string]$AssetId = 'PC2-HOST',
    [string]$OutputRoot = (Join-Path (Get-Location) ('evidence\asset-inventory\' + $AssetId + '-' + (Get-Date -Format 'yyyyMMdd-HHmmss')))
)

$ErrorActionPreference = 'Continue'
$principal = [Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw '관리자 권한 PowerShell에서 실행해야 OS, 네트워크, 서비스, Wazuh 정보를 완전하게 수집할 수 있습니다.'
}
New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null

function Export-SafeCsv {
    param([Parameter(ValueFromPipeline=$true)][object]$InputObject, [string]$Name)
    begin { $items = @() }
    process { $items += $InputObject }
    end { $items | Export-Csv -LiteralPath (Join-Path $OutputRoot $Name) -NoTypeInformation -Encoding UTF8 }
}

function Get-VersionResult {
    param([string]$Label, [string]$Command, [string[]]$Arguments = @())
    $resolved = Get-Command $Command -ErrorAction SilentlyContinue
    if ($null -eq $resolved) {
        return [pscustomobject]@{ Product = $Label; Installed = $false; Version = '' }
    }
    try {
        $text = (& $resolved.Source @Arguments 2>&1 | Select-Object -First 3) -join ' | '
        [pscustomobject]@{ Product = $Label; Installed = $true; Version = $text }
    } catch {
        [pscustomobject]@{ Product = $Label; Installed = $true; Version = $_.Exception.Message }
    }
}

$capturedAt = Get-Date
$os = Get-CimInstance Win32_OperatingSystem
$computer = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1

$summary = [ordered]@{
    AssetId = $AssetId
    Hostname = $env:COMPUTERNAME
    CapturedAt = $capturedAt.ToString('o')
    OS = $os.Caption
    OSVersion = $os.Version
    Architecture = $os.OSArchitecture
    Manufacturer = $computer.Manufacturer
    Model = $computer.Model
    CPU = $cpu.Name
    LogicalProcessors = $computer.NumberOfLogicalProcessors
    MemoryGiB = [math]::Round($computer.TotalPhysicalMemory / 1GB, 2)
    NetworkRole = if ($AssetId -eq 'WIN-01') { 'Current VMware NAT; logical MGMT target is 10.10.40.11' } else { 'PC2 physical host; Tailscale remote-management endpoint' }
}
$summary | ConvertTo-Json -Depth 4 | Out-File -LiteralPath (Join-Path $OutputRoot 'asset-summary.json') -Encoding utf8

Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -ne '127.0.0.1' } |
    Select-Object InterfaceAlias, IPAddress, PrefixLength, AddressState, PrefixOrigin, SuffixOrigin |
    Export-SafeCsv -Name 'network-ipv4.csv'

Get-NetRoute -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Select-Object DestinationPrefix, NextHop, InterfaceAlias, RouteMetric, Protocol, State |
    Export-SafeCsv -Name 'network-routes.csv'

Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |
    Select-Object DeviceID, VolumeName, FileSystem,
        @{n='SizeGiB';e={[math]::Round($_.Size / 1GB, 2)}},
        @{n='FreeGiB';e={[math]::Round($_.FreeSpace / 1GB, 2)}} |
    Export-SafeCsv -Name 'storage.csv'

Get-Service -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match 'Wazuh|W3SVC|IIS|Oracle|Tailscale|VMware|ssh' -or $_.DisplayName -match 'Wazuh|IIS|Oracle|Tailscale|VMware|OpenSSH' } |
    Select-Object Name, DisplayName, Status, StartType |
    Export-SafeCsv -Name 'services.csv'

Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Select-Object LocalAddress, LocalPort, OwningProcess |
    Sort-Object LocalPort |
    Export-SafeCsv -Name 'listening-tcp.csv'

Get-Process -ErrorAction SilentlyContinue |
    Select-Object Id, ProcessName, Path |
    Export-SafeCsv -Name 'process-map.csv'

$uninstallRoots = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
Get-ItemProperty $uninstallRoots -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName } |
    Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
    Sort-Object DisplayName -Unique |
    Export-SafeCsv -Name 'installed-software.csv'

@(
    Get-VersionResult 'Java' 'java' @('-version')
    Get-VersionResult 'Node.js' 'node' @('--version')
    Get-VersionResult 'npm' 'npm.cmd' @('--version')
    Get-VersionResult 'Git' 'git' @('--version')
    Get-VersionResult 'Tailscale' 'tailscale' @('version')
    Get-VersionResult 'OpenSSH' 'ssh' @('-V')
) | Export-SafeCsv -Name 'tool-versions.csv'

if (Get-Command Get-WindowsFeature -ErrorAction SilentlyContinue) {
    Get-WindowsFeature |
        Where-Object { $_.Installed -or $_.Name -match 'Web-Server' } |
        Select-Object Name, DisplayName, Installed, InstallState |
        Export-SafeCsv -Name 'windows-features.csv'
}

if (Get-Module -ListAvailable WebAdministration) {
    Import-Module WebAdministration -ErrorAction SilentlyContinue
    if (Get-Command Get-Website -ErrorAction SilentlyContinue) {
        Get-Website | Select-Object Name, State, PhysicalPath, Bindings |
            Export-SafeCsv -Name 'iis-websites.csv'
    }
}

$wazuhLog = 'C:\Program Files (x86)\ossec-agent\ossec.log'
if (Test-Path -LiteralPath $wazuhLog) {
    Get-Content -LiteralPath $wazuhLog -Tail 300 |
        Select-String -Pattern 'Connected to the server|Valid key received|ERROR|WARNING' |
        ForEach-Object { $_.Line } |
        Out-File -LiteralPath (Join-Path $OutputRoot 'wazuh-connection-log.txt') -Encoding utf8
}

Get-ChildItem -LiteralPath $OutputRoot -File |
    Where-Object { $_.Name -ne 'SHA256SUMS.csv' } |
    Get-FileHash -Algorithm SHA256 |
    Select-Object Path, Algorithm, Hash |
    Export-Csv -LiteralPath (Join-Path $OutputRoot 'SHA256SUMS.csv') -NoTypeInformation -Encoding UTF8

Write-Host ''
Write-Host 'Asset inventory completed.' -ForegroundColor Green
Write-Host ('Asset:  ' + $AssetId)
Write-Host ('Output: ' + (Resolve-Path -LiteralPath $OutputRoot))
Write-Host 'Review files before sharing; do not add passwords, API keys, or session cookies.' -ForegroundColor Yellow
