[CmdletBinding()]
param(
    [ValidateSet('Remote', 'Internal', 'All')]
    [string]$Profile = 'Remote',
    [int]$TimeoutMs = 2500,
    [string]$OutputPath = (Join-Path (Get-Location) ('evidence\asset-inventory\port-crosscheck-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.csv'))
)

function Test-TcpPortFast {
    param([string]$HostName, [int]$Port, [int]$WaitMs)
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $task = $client.ConnectAsync($HostName, $Port)
        if (-not $task.Wait($WaitMs)) { return $false }
        return $client.Connected
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

$remoteChecks = @(
    @{ Zone='TAILSCALE-NAT'; Host='100.67.232.28'; Port=2201; Service='SSH UNIX-01'; Expected='Open when UNIX-01 is on' },
    @{ Zone='TAILSCALE-NAT'; Host='100.67.232.28'; Port=2202; Service='SSH UNIX-02'; Expected='Open when UNIX-02 is on' },
    @{ Zone='TAILSCALE-NAT'; Host='100.67.232.28'; Port=2203; Service='SSH UNIX-03'; Expected='Open when UNIX-03 is on' },
    @{ Zone='TAILSCALE-NAT'; Host='100.67.232.28'; Port=2204; Service='SSH UNIX-04'; Expected='Open when UNIX-04 is on' },
    @{ Zone='WAZUH'; Host='100.117.65.81'; Port=1514; Service='Wazuh event collection'; Expected='Open' },
    @{ Zone='WAZUH'; Host='100.117.65.81'; Port=1515; Service='Wazuh agent enrollment'; Expected='Open' },
    @{ Zone='LOCAL-TUNNEL'; Host='127.0.0.1'; Port=8080; Service='UNIX-01 Apache tunnel'; Expected='Open only while 2201 tunnel runs' },
    @{ Zone='LOCAL-TUNNEL'; Host='127.0.0.1'; Port=8082; Service='UNIX-02 Apache tunnel'; Expected='Open only while 2202 tunnel runs' }
)

$internalChecks = @(
    @{ Zone='DMZ'; Host='10.10.10.11'; Port=80; Service='Apache booking/crew'; Expected='Open from routed MGMT' },
    @{ Zone='DMZ'; Host='10.10.10.12'; Port=80; Service='Apache partner/admin'; Expected='Open from routed MGMT' },
    @{ Zone='APP'; Host='10.10.20.11'; Port=8080; Service='Tomcat booking/crew'; Expected='Open from DMZ' },
    @{ Zone='APP'; Host='10.10.20.11'; Port=8081; Service='WildFly partner/admin'; Expected='Open from DMZ' },
    @{ Zone='DB'; Host='10.10.30.11'; Port=3306; Service='MySQL'; Expected='Open from APP; blocked from DMZ/user' },
    @{ Zone='DB'; Host='10.10.30.11'; Port=5432; Service='PostgreSQL'; Expected='Open from APP; blocked from DMZ/user' }
)

$checks = @()
if ($Profile -in @('Remote', 'All')) { $checks += $remoteChecks }
if ($Profile -in @('Internal', 'All')) { $checks += $internalChecks }

$results = foreach ($check in $checks) {
    $open = Test-TcpPortFast -HostName $check.Host -Port $check.Port -WaitMs $TimeoutMs
    [pscustomobject]@{
        CapturedAt = (Get-Date).ToString('o')
        Profile = $Profile
        Zone = $check.Zone
        Host = $check.Host
        Port = $check.Port
        Service = $check.Service
        TcpState = if ($open) { 'OPEN' } else { 'CLOSED_OR_FILTERED' }
        ExpectedContext = $check.Expected
    }
}

$parent = Split-Path -Parent $OutputPath
if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
$results | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
$results | Format-Table Zone, Host, Port, Service, TcpState -AutoSize
Write-Host ('Saved: ' + (Resolve-Path -LiteralPath $OutputPath)) -ForegroundColor Green

$nmap = Get-Command nmap -ErrorAction SilentlyContinue
if ($null -eq $nmap) {
    Write-Host 'Nmap is not installed. Native TCP results above are still valid.' -ForegroundColor Yellow
    Write-Host 'After installing Nmap, run: nmap -Pn -sT -n -p 2201-2204 100.67.232.28'
} else {
    Write-Host 'Nmap detected. Recommended independent cross-check:' -ForegroundColor Cyan
    Write-Host 'nmap -Pn -sT -n -p 2201-2204 100.67.232.28'
}
