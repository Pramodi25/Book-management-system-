import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useAuthors } from '../../hooks/useAuthors';
import { usePublishers } from '../../hooks/usePublishers';

const BookForm = ({ initialData, onSubmit, loading }) => {
  const [book, setBook] = useState({
    bookId: '',
    authorId: '',
    publisherId: '',
    title: '',
    publicationDate: '',
    isbn: '',
    pages: 0,
    genre: '',
    description: '',
    price: 0,
    quantity: 0
  });
  
  const [errors, setErrors] = useState({});
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', bio: '' });
  const [newPublisher, setNewPublisher] = useState({ name: '', address: '' });
  
  const { addAuthor, fetchAuthors, loading: authorLoading } = useAuthors();
  const { addPublisher, fetchPublishers, loading: publisherLoading } = usePublishers();
  
  // Fetch authors and publishers on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch authors
        const authorsData = await fetchAuthors();
        if (authorsData && authorsData.authors) {
          const authorOptions = authorsData.authors.map(author => ({
            value: author.authorId,
            label: author.name
          }));
          setAuthors(authorOptions);
          console.log('Loaded authors:', authorOptions);
        }
        
        // Fetch publishers
        const publishersData = await fetchPublishers();
        if (publishersData && publishersData.publishers) {
          const publisherOptions = publishersData.publishers.map(publisher => ({
            value: publisher.publisherId || publisher.publisher_id,
            label: publisher.name
          }));
          setPublishers(publisherOptions);
          console.log('Loaded publishers:', publisherOptions);
        }
      } catch (error) {
        console.error('Failed to load form data:', error);
      }
    };
    
    loadData();
  }, [fetchAuthors, fetchPublishers]);
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setBook(initialData);
    } else {
      // Generate UUID for new book
      setBook(prev => ({ ...prev, bookId: uuidv4() }));
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert certain fields to appropriate types
    let parsedValue = value;
    if (name === 'pages' || name === 'quantity') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    } else if (name === 'price') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setBook(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!book.title.trim()) newErrors.title = 'Title is required';
    if (!book.authorId) newErrors.authorId = 'Author is required';
    if (!book.publisherId) newErrors.publisherId = 'Publisher is required';
    if (!book.publicationDate) newErrors.publicationDate = 'Publication date is required';
    if (!book.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!book.genre.trim()) newErrors.genre = 'Genre is required';
    if (book.pages <= 0) newErrors.pages = 'Pages must be greater than 0';
    if (book.price < 0) newErrors.price = 'Price cannot be negative';
    if (book.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(book);
    }
  };
  
  // Handle new author submission
  const handleAuthorSubmit = async (e) => {
    e.preventDefault();
    
    if (!newAuthor.name.trim()) {
      setErrors(prev => ({ ...prev, newAuthorName: 'Author name is required' }));
      return;
    }
    
    try {
      const authorData = {
        authorId: uuidv4(),
        name: newAuthor.name,
        bio: newAuthor.bio
      };
      
      const createdAuthor = await addAuthor(authorData);
      if (createdAuthor) {
        // Add to authors list and select it
        setAuthors(prev => [...prev, { value: createdAuthor.authorId, label: createdAuthor.name }]);
        setBook(prev => ({ ...prev, authorId: createdAuthor.authorId }));
        setShowAuthorForm(false);
        setNewAuthor({ name: '', bio: '' });
      }
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };
  
  // Handle new publisher submission
  const handlePublisherSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPublisher.name.trim()) {
      setErrors(prev => ({ ...prev, newPublisherName: 'Publisher name is required' }));
      return;
    }
    
    try {
      const publisherData = {
        publisherId: uuidv4(),
        name: newPublisher.name,
        address: newPublisher.address
      };
      
      const createdPublisher = await addPublisher(publisherData);
      if (createdPublisher) {
        // Add to publishers list and select it
        setPublishers(prev => [...prev, { value: createdPublisher.publisherId, label: createdPublisher.name }]);
        setBook(prev => ({ ...prev, publisherId: createdPublisher.publisherId }));
        setShowPublisherForm(false);
        setNewPublisher({ name: '', address: '' });
      }
    } catch (error) {
      console.error('Failed to create publisher:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          name="title"
          value={book.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <div>
          <Select
            label="Author"
            name="authorId"
            value={book.authorId}
            onChange={handleChange}
            options={authors}
            placeholder="Select an author"
            error={errors.authorId}
            required
          />
          {!showAuthorForm ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setShowAuthorForm(true)}
            >
              Add New Author
            </Button>
          ) : (
            <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium mb-2">New Author</h4>
              <Input
                label="Name"
                value={newAuthor.name}
                onChange={e => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                error={errors.newAuthorName}
              />
              <Input
                label="Bio"
                value={newAuthor.bio}
                onChange={e => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
              />
              <div className="flex space-x-2 mt-2">
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAuthorSubmit}
                  disabled={authorLoading}
                >
                  Add
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    setShowAuthorForm(false);
                    setNewAuthor({ name: '', bio: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Select
            label="Publisher"
            name="publisherId"
            value={book.publisherId}
            onChange={handleChange}
            options={publishers}
            placeholder="Select a publisher"
            error={errors.publisherId}
            required
          />
          {!showPublisherForm ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setShowPublisherForm(true)}
            >
              Add New Publisher
            </Button>
          ) : (
            <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium mb-2">New Publisher</h4>
              <Input
                label="Name"
                value={newPublisher.name}
                onChange={e => setNewPublisher(prev => ({ ...prev, name: e.target.value }))}
                error={errors.newPublisherName}
              />
              <Input
                label="Address"
                value={newPublisher.address}
                onChange={e => setNewPublisher(prev => ({ ...prev, address: e.target.value }))}
              />
              <div className="flex space-x-2 mt-2">
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handlePublisherSubmit}
                  disabled={publisherLoading}
                >
                  Add
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    setShowPublisherForm(false);
                    setNewPublisher({ name: '', address: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Input
          label="Publication Date"
          name="publicationDate"
          type="date"
          value={book.publicationDate}
          onChange={handleChange}
          error={errors.publicationDate}
          required
        />
        
        <Input
          label="ISBN"
          name="isbn"
          value={book.isbn}
          onChange={handleChange}
          error={errors.isbn}
          required
        />
        
        <Input
          label="Genre"
          name="genre"
          value={book.genre}
          onChange={handleChange}
          error={errors.genre}
          required
        />
        
        <Input
          label="Pages"
          name="pages"
          type="number"
          value={book.pages}
          onChange={handleChange}
          error={errors.pages}
          required
        />
        
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={book.price}
          onChange={handleChange}
          error={errors.price}
          required
        />
        
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={book.quantity}
          onChange={handleChange}
          error={errors.quantity}
          required
        />
      </div>
      
      <Input
        label="Description"
        name="description"
        value={book.description}
        onChange={handleChange}
        error={errors.description}
      />
      
      <div className="flex space-x-4">
        <Button type="submit" disabled={loading}>
          {initialData ? 'Update Book' : 'Create Book'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BookForm;