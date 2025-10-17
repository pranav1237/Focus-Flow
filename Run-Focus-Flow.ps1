# Set the current directory to the script's directory
Set-Location -Path $PSScriptRoot

# Run the commands in a hidden cmd window, similar to the VBS script
$cmd = "npm install --no-audit --no-fund && npm run dev -- --host --open"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c $cmd" -WindowStyle Hidden