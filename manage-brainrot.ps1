param (
    [string]$Action
)

Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class Win32 {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
        
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        
        public const uint SWP_NOZORDER = 0x0004;
        public const uint SWP_SHOWWINDOW = 0x0040;
        public const int SW_RESTORE = 9;
    }
"@

Add-Type -AssemblyName System.Windows.Forms

function Get-ScreenResolution {
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
    return $screen.Bounds
}

if ($Action -eq "start") {
    $bounds = Get-ScreenResolution
    $width = $bounds.Width
    $height = $bounds.Height
    
    $url = "https://www.tiktok.com/foryou"

    # Find Chrome executable
    $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (-not (Test-Path $chromePath)) {
        $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    }
    if (-not (Test-Path $chromePath)) {
        $chromePath = "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    }
    
    if (-not (Test-Path $chromePath)) {
        Write-Error "Chrome not found!"
        exit 1
    }

    # Create persistent directory for profile data
    $profileDir = "$env:APPDATA\brainrot-chrome\tiktok"
    if (-not (Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    
    # Start Chrome with separate profile - fullscreen
    $args = @(
        "--user-data-dir=$profileDir",
        "--new-window",
        "--start-fullscreen",
        "$url"
    )
    
    Start-Process $chromePath -ArgumentList $args
}
elseif ($Action -eq "stop") {
    # Find all Chrome processes using the brainrot profile directory
    $profileDir = "$env:APPDATA\brainrot-chrome\tiktok"
    
    # Get all Chrome processes
    $allChrome = Get-Process chrome -ErrorAction SilentlyContinue
    
    $closedCount = 0
    foreach ($proc in $allChrome) {
        try {
            # Check if this process is using our profile
            $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($proc.Id)" -ErrorAction SilentlyContinue).CommandLine
            
            if ($cmdLine -and $cmdLine -match [regex]::Escape($profileDir)) {
                if ($proc.MainWindowHandle -ne 0) {
                    Write-Host "Closing brainrot window: $($proc.MainWindowTitle)"
                }
                $proc.Kill()
                $closedCount++
            }
        } catch {
            # Ignore errors
        }
    }
    
    if ($closedCount -eq 0) {
        Write-Host "No brainrot windows found"
    } else {
        Write-Host "Closed $closedCount brainrot process(es)"
    }
}
