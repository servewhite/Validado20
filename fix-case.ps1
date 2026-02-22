Write-Host "=== Convertendo case com renomeacao TMP ===" -ForegroundColor Green

$sitePath = "c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app"
$changeCount = 0
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Pegar todos os arquivos e pastas recursivamente
$items = Get-ChildItem -Path $sitePath -Recurse -Force

foreach ($item in $items) {
    $lowerName = $item.Name.ToLower()
    
    # Comparar o nome original com minúsculas (case-sensitive)
    $needsRename = $false
    
    for ($i = 0; $i -lt $item.Name.Length; $i++) {
        if ([char]::IsUpper($item.Name[$i])) {
            $needsRename = $true
            break
        }
    }
    
    if ($needsRename) {
        try {
            $tmpName = "TEMP_$timestamp" 
            $tmpPath = Join-Path -Path $item.Parent.FullName -ChildPath $tmpName
            $finalPath = Join-Path -Path $item.Parent.FullName -ChildPath $lowerName
            
            # Renomear para tmp
            Move-Item -Path $item.FullName -Destination $tmpPath -Force -ErrorAction Stop
            
            # Renomear de tmp para final  
            Move-Item -Path $tmpPath -Destination $finalPath -Force -ErrorAction Stop
            
            Write-Host "OK: $($item.Name) -> $lowerName" -ForegroundColor Green
            $changeCount++
        }
        catch {
            Write-Host "ERRO em $($item.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host "`nTotal de mudancas: $changeCount" -ForegroundColor Green
