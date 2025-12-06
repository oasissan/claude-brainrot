# Test script to understand Chrome window behavior

Write-Host "Opening 4 Chrome windows..."

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}
if (-not (Test-Path $chromePath)) {
    $chromePath = "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
}

$urls = @(
    "https://www.tiktok.com/foryou",
    "https://www.instagram.com/reels/",
    "https://www.youtube.com/shorts",
    "https://x.com/"
)

foreach ($url in $urls) {
    Start-Process $chromePath -ArgumentList "--new-window", "$url"
    Start-Sleep -Milliseconds 500
}

Start-Sleep -Seconds 3

Write-Host "`nAll Chrome processes with windows:"
$windows = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
foreach ($w in $windows) {
    Write-Host "PID: $($w.Id) | Handle: $($w.MainWindowHandle) | Title: $($w.MainWindowTitle) | StartTime: $($w.StartTime)"
}

Write-Host "`nTotal windows: $($windows.Count)"
