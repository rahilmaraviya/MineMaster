# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# ./custom.ps1
# 1. Define the dynamic output filename using the current timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFilename = "Directory_Scan_$timestamp.txt"
$outputFile = Join-Path -Path (Get-Location) -ChildPath $outputFilename

Write-Host "Scanning directory... Output will be saved to: $outputFilename" -ForegroundColor Cyan

# 2. Get all files recursively
# -Recurse: Looks in subfolders
# -File: Ignores folders (only looks for files)
# Where-Object: Filters out .ps1 files and the new output file itself (to prevent loops)
$filesToScan = Get-ChildItem -Path . -Recurse -File | 
               Where-Object { $_.Extension -ne ".ps1" -and $_.Name -ne $outputFilename }

# 3. Process each file
foreach ($file in $filesToScan) {
    
    # Format the header: Full Path/Filename.extension
    $header = "FILE PATH: $($file.FullName)"
    
    # Append the Header to the output file
    Add-Content -Path $outputFile -Value $header
    Add-Content -Path $outputFile -Value "" # Adds the required new line

    # 4. Read and Append Content
    try {
        # -Raw reads the whole file as one string to preserve original formatting
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
        Add-Content -Path $outputFile -Value $content
    }
    catch {
        # If the file is binary (like an image) or locked, log a small error in the file
        Add-Content -Path $outputFile -Value "[Could not read content: File might be binary or in use]"
    }

    # Optional: Adds a divider line and spacing between files for readability
    Add-Content -Path $outputFile -Value "`n--------------------------------------------------`n"
}

Write-Host "Done! Scanned $($filesToScan.Count) files." -ForegroundColor Green