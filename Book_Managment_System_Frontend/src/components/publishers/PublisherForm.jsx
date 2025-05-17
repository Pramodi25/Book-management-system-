import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * PublisherForm component for creating and editing publishers
 */
const PublisherForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    website: '',
    foundedYear: '',
    description: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Update form when initialData changes (edit mode)
  useEffect(() => {
    if (Object.keys(initialData).length) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Publisher name is required';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (formData.foundedYear) {
      const year = parseInt(formData.foundedYear);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year) || year < 1400 || year > currentYear) {
        newErrors.foundedYear = `Founded year must be between 1400 and ${currentYear}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Publisher Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="location"
          label="Location"
          value={formData.location || ''}
          onChange={handleChange}
          error={errors.location}
        />
        
        <Input
          name="foundedYear"
          label="Founded Year"
          type="number"
          value={formData.foundedYear || ''}
          onChange={handleChange}
          error={errors.foundedYear}
        />
      </div>
      
      <Input
        name="website"
        label="Website"
        type="url"
        value={formData.website || ''}
        onChange={handleChange}
        error={errors.website}
        placeholder="https://"
      />
      
      <div className="mb-4">
        <label 
          htmlFor="description" 
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData.id ? 'Update Publisher' : 'Create Publisher'}
        </Button>
      </div>
    </form>
  );
};

PublisherForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default PublisherForm;