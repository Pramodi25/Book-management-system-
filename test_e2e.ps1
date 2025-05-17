# Test end-to-end functionality by creating an author, publisher, and book
# This script demonstrates how to use the APIs properly from the client side

# 1. Create an author
Write-Host "Creating test author..." -ForegroundColor Cyan
$authorId = [guid]::NewGuid().ToString()
$authorData = @{
    authorId = $authorId
    name = "Test Author with UUID"
    bio = "This is a test author created with a UUID"
} | ConvertTo-Json

Write-Host "Author data being sent: $authorData"
$author = Invoke-RestMethod -Uri "http://localhost:8081/authors" -Method Post -Body $authorData -ContentType "application/json"
Write-Host "Author created successfully: $($author.name) with ID: $($author.authorId)" -ForegroundColor Green

# 2. Create a publisher
Write-Host "Creating test publisher..." -ForegroundColor Cyan
$publisherId = [guid]::NewGuid().ToString()
$publisherData = @{
    publisher_id = $publisherId
    name = "Test Publisher with UUID"
    address = "123 Test Street, Test City"
} | ConvertTo-Json

Write-Host "Publisher data being sent: $publisherData"
$publisher = Invoke-RestMethod -Uri "http://localhost:8081/publishers" -Method Post -Body $publisherData -ContentType "application/json"
Write-Host "Publisher created successfully: $($publisher.name) with ID: $($publisher.publisherId)" -ForegroundColor Green

# 3. Create a book
Write-Host "Creating test book..." -ForegroundColor Cyan
$bookId = [guid]::NewGuid().ToString()
$bookData = @{
    bookId = $bookId
    authorId = $author.authorId
    publisherId = $publisher.publisherId
    title = "Test Book with UUIDs"
    publicationDate = (Get-Date).ToString("yyyy-MM-dd")
    isbn = "978-3-16-148410-0"
    pages = 200
    genre = "Test Fiction"
    description = "This is a test book with properly formatted UUIDs"
    price = 29.99
    quantity = 50
} | ConvertTo-Json

Write-Host "Book data being sent: $bookData"
$book = Invoke-RestMethod -Uri "http://localhost:8081/books" -Method Post -Body $bookData -ContentType "application/json"
Write-Host "Book created successfully: $($book.title) with ID: $($book.bookId)" -ForegroundColor Green

# 4. Get all books to verify
Write-Host "Getting all books..." -ForegroundColor Cyan
$books = Invoke-RestMethod -Uri "http://localhost:8081/books" -Method Get
Write-Host "Found $($books.books.Count) books" -ForegroundColor Green

# 5. Summary
Write-Host "`nTesting completed successfully!" -ForegroundColor Green
Write-Host "Created Author: $($author.name) with ID: $($author.authorId)"
Write-Host "Created Publisher: $($publisher.name) with ID: $($publisher.publisherId)"
Write-Host "Created Book: $($book.title) with ID: $($book.bookId)"
