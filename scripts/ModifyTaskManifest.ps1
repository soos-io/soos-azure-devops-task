Param(
  [string] $TaskId,
  [string] $TaskName,
  [string] $TaskVersion,
  [string] $TaskJsonPath
)

$taskManifest = Get-Content -Path $TaskJsonPath | ConvertFrom-Json
$taskManifest.id = $TaskId
$taskManifest.name = $TaskName -replace '\s','-'
$taskManifest.friendlyName = $TaskName
$taskManifest.instanceNameFormat = "$($TaskName): `$(projectName)"

$Major, $Minor, $Patch = $TaskVersion.Split(".")
$taskManifest.version.Major = [int]$Major
$taskManifest.version.Minor = [int]$Minor
$taskManifest.version.Patch = [int]$Patch

$taskJsonFile = ConvertTo-Json $taskManifest -Depth 10
Write-Host $taskJsonFile
Set-Content -Path $taskJsonPath -Value $taskJsonFile
