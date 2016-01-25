start-process powershell -ArgumentList "-File .\server.ps1"
Start-Sleep -s 1
start-process powershell -ArgumentList "-File .\client.ps1"
