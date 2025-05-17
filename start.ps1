try {
    Write-Host "Starting Invoice Builder application..." -ForegroundColor Cyan
    Set-Location "c:\Users\Ayush\Desktop\Hackathon\Invoice Builder\invoice-builder"
    
    # Check if node_modules exists, if not run npm install
    if (-not (Test-Path -Path "node_modules")) {
        Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
        npm install
    }
    
    # Start the application
    npm start
}
catch {
    Write-Host "An error occurred while starting the application:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
