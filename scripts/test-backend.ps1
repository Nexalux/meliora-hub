param(
    [string]$ApiBaseUrl = "http://localhost:8080/meliorahub/wp-json",
    [string]$PhpExecutable = "D:\xampp\php\php.exe"
)

$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$pluginPath = Join-Path $repositoryRoot "backend-wordpress\meliora-core"

if (-not (Test-Path -LiteralPath $PhpExecutable -PathType Leaf)) {
    throw "PHP executable not found: $PhpExecutable"
}

$phpFiles = Get-ChildItem -LiteralPath $pluginPath -Recurse -Filter "*.php" -File

foreach ($phpFile in $phpFiles) {
    & $PhpExecutable -l $phpFile.FullName | Out-Null

    if ($LASTEXITCODE -ne 0) {
        throw "PHP syntax check failed: $($phpFile.FullName)"
    }
}

$roadmapUrl = "$($ApiBaseUrl.TrimEnd('/'))/meliora/v1/roadmaps"
$roadmaps = @(
    Invoke-RestMethod -Uri $roadmapUrl -Method Get |
        ForEach-Object { $_ }
)

if ($roadmaps.Count -eq 0) {
    throw "The roadmap list API returned no roadmaps."
}

$firstRoadmapFields = $roadmaps[0].PSObject.Properties.Name

if ($firstRoadmapFields -contains "steps") {
    throw "The roadmap list API unexpectedly includes the full steps payload."
}

if ($firstRoadmapFields -notcontains "steps_count") {
    throw "The roadmap list API is missing steps_count."
}

$allowedResponse = Invoke-WebRequest `
    -Uri $roadmapUrl `
    -Method Get `
    -Headers @{ Origin = "http://localhost:5173" } `
    -UseBasicParsing

if (
    $allowedResponse.Headers["Access-Control-Allow-Origin"] -ne
    "http://localhost:5173"
) {
    throw "The configured local frontend origin was not allowed."
}

$blockedResponse = Invoke-WebRequest `
    -Uri $roadmapUrl `
    -Method Get `
    -Headers @{ Origin = "https://unapproved.example" } `
    -UseBasicParsing

if ($blockedResponse.Headers["Access-Control-Allow-Origin"]) {
    throw "An unapproved origin received a CORS allow header."
}

Write-Host "Backend checks passed."
Write-Host "PHP files checked: $($phpFiles.Count)"
Write-Host "Roadmaps returned: $($roadmaps.Count)"
