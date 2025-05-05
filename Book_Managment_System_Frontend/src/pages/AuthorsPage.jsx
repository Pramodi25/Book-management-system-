import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuthors } from '../hooks/useAuthors';
import { v4 as uuidv4 } from 'uuid';

const AuthorsPage = () => {
  const navigate = useNavigate();
  const { addAuthor, loading, error } = useAuthors();
  const [author, setAuthor] = useState({
    authorId: uuidv4(),
    name: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor(prev => ({ ...prev, [name]: value }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!author.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!author.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const result = await addAuthor(author);
        
        if (result) {
          setSuccessMessage('Author created successfully!');
          setAuthor({
            authorId: uuidv4(),
            name: '',
            bio: ''
          });
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, submit: err.message }));
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Author</h1>
      
      <Card>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={author.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <Input
            label="Bio"
            name="bio"
            value={author.bio}
            onChange={handleChange}
            error={errors.bio}
            required
          />
          
          <div className="flex space-x-4 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Author'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthorsPage;