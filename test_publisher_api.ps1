$publisherData = @{
    publisher_id = [guid]::NewGuid().ToString()
    name = "Test Publisher"
    address = "123 Publisher St"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/publishers" -Method Post -Body $publisherData -ContentType "application/json" -Verbose
