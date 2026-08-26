$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'content/anime-source.json'
$cachePath = Join-Path $projectRoot 'work/anime-sync'
$headers = @{
  'User-Agent' = 'sekai-zero/0.1.0 (https://github.com/miku-qaq/sekai-zero)'
}

New-Item -ItemType Directory -Path $cachePath -Force | Out-Null
$source = Get-Content -Raw -LiteralPath $sourcePath | ConvertFrom-Json

function Invoke-AnimeRequest {
  param(
    [Parameter(Mandatory = $true)]
    [scriptblock]$Operation,
    [Parameter(Mandatory = $true)]
    [string]$Label
  )

  $lastError = $null
  foreach ($attempt in 1..4) {
    try {
      & $Operation
      return
    }
    catch {
      $lastError = $_
      if ($attempt -lt 4) {
        Start-Sleep -Seconds ([Math]::Min(2 * $attempt, 6))
      }
    }
  }

  throw "Unable to retrieve $Label after four attempts: $($lastError.Exception.Message)"
}

for ($index = 0; $index -lt $source.Count; $index++) {
  $item = $source[$index]
  $detailPath = Join-Path $cachePath "$($item.id).json"
  $imagePath = Join-Path $cachePath "$($item.id).image"
  $detailUrl = "https://api.bgm.tv/v0/subjects/$($item.bangumiId)"

  Invoke-AnimeRequest -Label "$($item.rawTitle) metadata" -Operation {
    Invoke-WebRequest -Uri $detailUrl -Headers $headers -OutFile $detailPath -TimeoutSec 35
  }

  $detail = Get-Content -Raw -LiteralPath $detailPath | ConvertFrom-Json
  $imageUrl = if ($detail.images.large) {
    $detail.images.large
  }
  elseif ($detail.images.common) {
    $detail.images.common
  }
  else {
    $detail.images.medium
  }

  if (-not $imageUrl) {
    throw "Bangumi subject $($item.bangumiId) has no cover image."
  }

  Invoke-AnimeRequest -Label "$($item.rawTitle) cover" -Operation {
    Invoke-WebRequest -Uri $imageUrl -Headers $headers -OutFile $imagePath -TimeoutSec 35
  }

  if ((Get-Item -LiteralPath $imagePath).Length -le 0) {
    throw "Downloaded an empty cover for $($item.rawTitle)."
  }

  Write-Output "[$(($index + 1).ToString().PadLeft(2, '0'))/$($source.Count)] $($item.rawTitle)"
}

$env:ANIME_SYNC_CACHE_DIR = 'work/anime-sync'
node (Join-Path $PSScriptRoot 'sync-anime-covers.mjs')
if ($LASTEXITCODE -ne 0) {
  throw "The local cover optimization step failed with exit code $LASTEXITCODE."
}
