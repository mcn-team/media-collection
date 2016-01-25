$path = Get-Location
if ($path -match "scripts") {
    iex "cd ../"
}
$path = Get-Location
$files = Get-ChildItem $path
if ($files -Match "package.json") {
    iex "npm install"
    iex "npm install -g gulp-cli"
    iex "npm install -g nodemon"
    Write-Host "Installation finished"
    Write-Host "Press a key to quit..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
else {
    Write-Host "Installation failed. Script is not in the right folder"
    Write-Host "Press a key to quit..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
