Write-Host "=== Convertendo TUDO para MINUSCULAS ===" -ForegroundColor Green

$sitePath = "c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app"
$changeCount = 0

# PASSO 1: Renomear pastas
Write-Host "`nPasso 1: Renomeando PASTAS..." -ForegroundColor Cyan
$folders = Get-ChildItem -Path $sitePath -Directory -Force -Recurse | Sort-Object -Property FullName -Descending

foreach ($folder in $folders) {
    $lowerName = $folder.Name.ToLower()
    if ($folder.Name -ne $lowerName) {
        try {
            Rename-Item -Path $folder.FullName -NewName $lowerName -Force -ErrorAction Stop
            Write-Host "OK: $($folder.Name) -> $lowerName"
            $changeCount++
        }
        catch {
            Write-Host "ERRO: $($folder.FullName)"
        }
    }
}

# PASSO 2: Renomear arquivos  
Write-Host "`nPasso 2: Renomeando ARQUIVOS..." -ForegroundColor Cyan
$files = Get-ChildItem -Path $sitePath -File -Recurse -Force

foreach ($file in $files) {
    $lowerName = $file.Name.ToLower()
    if ($file.Name -ne $lowerName) {
        try {
            Rename-Item -Path $file.FullName -NewName $lowerName -Force -ErrorAction Stop
            Write-Host "OK: $($file.Name) -> $lowerName"
            $changeCount++
        }
        catch {
            Write-Host "ERRO: $($file.FullName)"
        }
    }
}

Write-Host "`nTotal de mudancas: $changeCount" -ForegroundColor Green
Write-Host "`nTarefa concluida!" -ForegroundColor Green
