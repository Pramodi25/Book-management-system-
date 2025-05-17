# Test script to verify the book API works
# First, create an author
$authorData = @{
    authorId = [guid]::NewGuid().ToString()
    name = "Test Author for Book"
    bio = "A test author bio"
} | ConvertTo-Json

Write-Host "Creating author..."
$author = Invoke-RestMethod -Uri "http://localhost:8081/authors" -Method Post -Body $authorData -ContentType "application/json"
$authorId = $author.authorId

# Next, create a publisher
$publisherData = @{
    publisher_id = [guid]::NewGuid().ToString()
    name = "Test Publisher for Book"
    address = "123 Publisher St"
} | ConvertTo-Json

Write-Host "Creating publisher..."
$publisher = Invoke-RestMethod -Uri "http://localhost:8081/publishers" -Method Post -Body $publisherData -ContentType "application/json"
$publisherId = $publisher.publisher_id

# Finally, create a book
$bookData = @{
    bookId = [guid]::NewGuid().ToString()
    authorId = $authorId
    publisherId = $publisherId
    title = "Test Book"
    publicationDate = (Get-Date).ToString("yyyy-MM-dd")
    isbn = "978-1-234567-89-0"
    pages = 200
    genre = "Test"
    description = "A test book"
    price = 19.99
    quantity = 10
} | ConvertTo-Json

Write-Host "Creating book with data: $bookData"
Invoke-RestMethod -Uri "http://localhost:8081/books" -Method Post -Body $bookData -ContentType "application/json" -Verbose
