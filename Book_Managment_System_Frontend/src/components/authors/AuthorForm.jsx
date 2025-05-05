import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * AuthorForm component for creating and editing authors
 */
const AuthorForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    biography: '',
    birthDate: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Update form when initialData changes (edit mode)
  useEffect(() => {
    if (Object.keys(initialData).length) {
      setFormData({ 
        ...initialData,
        // Format the birthDate if it exists in initialData
        birthDate: initialData.birthDate 
          ? new Date(initialData.birthDate).toISOString().split('T')[0]
          : '',
      });
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      const now = new Date();
      
      if (isNaN(date.getTime())) {
        newErrors.birthDate = 'Invalid date format';
      } else if (date > now) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert birthDate to ISO string if it exists
      const submissionData = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
      };
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        
        <Input
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>
      
      <Input
        name="birthDate"
        label="Birth Date"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        error={errors.birthDate}
      />
      
      <div className="mb-4">
        <label 
          htmlFor="biography" 
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Biography
        </label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        />
        {errors.biography && (
          <p className="mt-1 text-sm text-red-600">{errors.biography}</p>
        )}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData.id ? 'Update Author' : 'Create Author'}
        </Button>
      </div>
    </form>
  );
};

AuthorForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AuthorForm;