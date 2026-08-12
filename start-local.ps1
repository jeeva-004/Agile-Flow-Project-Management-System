# Read .env file and set environment variables in the current process
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split("=", 2)
            if ($key -and $value) {
                [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), "Process")
            }
        }
    }
}

# Defaults if not defined
$dbHost = $env:DB_HOST
if (-not $dbHost) { $dbHost = "localhost" }
$dbPort = $env:DB_PORT
if (-not $dbPort) { $dbPort = "3308" }
$port = $env:PORT
if (-not $port) { $port = "8080" }
$frontendPort = $env:FRONTEND_PORT
if (-not $frontendPort) { $frontendPort = "4200" }

Write-Host "Checking if MySQL is running on $dbHost:$dbPort..." -ForegroundColor Cyan
$portCheck = Get-NetTCPConnection -LocalPort $dbPort -ErrorAction SilentlyContinue
if (-not $portCheck) {
    Write-Host "MySQL is NOT running on port $dbPort. Attempting to start MySQL service..." -ForegroundColor Yellow
    # Try starting default MySQL service name (requires Admin privileges)
    Start-Service -Name "MySQL" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    $portCheck = Get-NetTCPConnection -LocalPort $dbPort -ErrorAction SilentlyContinue
    if (-not $portCheck) {
        Write-Warning "Could not verify MySQL is running. Please make sure your native MySQL is started on port $dbPort."
    } else {
        Write-Host "MySQL service started successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "MySQL is active on port $dbPort." -ForegroundColor Green
}

# Install backend dependencies & compile
Write-Host "`nPreparing backend..." -ForegroundColor Cyan
Push-Location agileflow-backend
if (Test-Path "mvnw.cmd") {
    Write-Host "Building backend with Maven..."
    ./mvnw clean compile
} else {
    Write-Warning "Maven wrapper not found. Ensure maven is installed."
}
Pop-Location

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Cyan
Push-Location agileflow-frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found, running npm install..."
    npm install
} else {
    Write-Host "node_modules already exists, skipping installation."
}
Pop-Location

# Launch backend and frontend concurrently
Write-Host "`nLaunching backend and frontend concurrently..." -ForegroundColor Green

# Prepare backend execution command
$backendCmd = "cd agileflow-backend; `$env:DB_HOST='$dbHost'; `$env:DB_PORT='$dbPort'; `$env:DB_NAME='$($env:DB_NAME)'; `$env:DB_USER='$($env:DB_USER)'; `$env:DB_PASSWORD='$($env:DB_PASSWORD)'; `$env:PORT='$port'; `$env:JWT_SECRET='$($env:JWT_SECRET)'; `$env:JWT_EXPIRATION='$($env:JWT_EXPIRATION)'; `$env:UPLOAD_DIR='$($env:UPLOAD_DIR)'; ./mvnw spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Prepare frontend execution command
$frontendCmd = "cd agileflow-frontend; npm start -- --port $frontendPort"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "`nServices launched!" -ForegroundColor Green
Write-Host "Frontend should be available at http://localhost:$frontendPort"
Write-Host "Backend API should be available at http://localhost:$port/api/v1"
