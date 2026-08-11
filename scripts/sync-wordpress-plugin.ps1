param(
    [string]$Target = "D:\xampp\htdocs\meliorahub\wp-content\plugins\meliora-core"
)

$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repositoryRoot "backend-wordpress\meliora-core"

if (-not (Test-Path -LiteralPath (Join-Path $source "meliora-core.php"))) {
    throw "Canonical plugin source was not found at: $source"
}

if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}

$resolvedSource = (Resolve-Path -LiteralPath $source).Path
$resolvedTarget = (Resolve-Path -LiteralPath $Target).Path

if ($resolvedSource -eq $resolvedTarget) {
    throw "Source and target must be different directories."
}

Get-ChildItem -LiteralPath $resolvedSource -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($resolvedSource.Length).TrimStart("\")
    $destination = Join-Path $resolvedTarget $relativePath
    $destinationDirectory = Split-Path -Parent $destination

    if (-not (Test-Path -LiteralPath $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    }

    Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
}

Write-Output "Meliora Core synchronized successfully."
Write-Output "Source: $resolvedSource"
Write-Output "Target: $resolvedTarget"
