$authorData = @{
    authorId = [guid]::NewGuid().ToString()
    name = "Test Author"
    bio = "A test author bio"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/authors" -Method Post -Body $authorData -ContentType "application/json" -Verbose
