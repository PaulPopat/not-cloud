$ErrorActionPreference = "Stop"
$tag = Read-Host "Please enter a tag name (e.g. 1.0.0)"

try {
  Write-Output "Preparing Not Cloud Sync"
  Set-Location "./not-cloud-sync"
  npm install
  npm run package
  
  Write-Output "Copying compiled result to server"
  Set-Location $PSScriptRoot
  try {
    New-Item "./not-cloud-server/public" -Name "application" -ItemType "directory"
  } catch {}
  Copy-Item "./not-cloud-sync/dist/Not Cloud Sync Setup 1.0.0.exe" "./not-cloud-server/public/application/not-cloud-sync-setup.exe"

  Write-Output "Building the docker image"
  Set-Location "./not-cloud-server"
  npm install
  Get-Content Dockerfile | docker build -t paulpopat/not-cloud:$tag .
  docker run paulpopat/not-cloud:$tag
  docker push paulpopat/not-cloud:$tag

  Write-Output "Preparing the installer file"
  Set-Location $PSScriptRoot
  $installer = Get-Content "./not-cloud-installer.sh"
  $installer.Replace("NOT_CLOUD_VERSION", $tag) | Out-File -FilePath "./not-cloud-installer-v$tag.sh"
  
} finally {
  Set-Location $PSScriptRoot
}
