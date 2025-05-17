import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAppContext } from '../../contexts/AppContext';
import { 
  required, 
  minLength, 
  isDate, 
  validateForm
} from '../../utils/validators';

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

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const { actions } = useAppContext();

  // Validation schema
  const validationSchema = {
    firstName: [
      required('First name is required'),
      minLength(2, 'First name must be at least 2 characters')
    ],
    lastName: [
      required('Last name is required'),
      minLength(2, 'Last name must be at least 2 characters')
    ],
    birthDate: isDate({ 
      max: new Date(), 
      message: 'Birth date cannot be in the future'
    })
  };

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

  // Validate on touched fields or all fields on submit
  useEffect(() => {
    const fieldsToValidate = Object.keys(touched).filter(key => touched[key]);
    
    if (fieldsToValidate.length > 0) {
      const validationRules = {};
      
      fieldsToValidate.forEach(field => {
        if (validationSchema[field]) {
          validationRules[field] = validationSchema[field];
        }
      });
      
      const newErrors = validateForm(formData, validationRules);
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [formData, touched, validationSchema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateAuthorForm = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce(
      (acc, field) => ({ ...acc, [field]: true }), 
      {}
    );
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = validateForm(formData, validationSchema);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateAuthorForm()) {
      try {
        // Convert birthDate to ISO string if it exists
        const submissionData = {
          ...formData,
          birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        };
        
        onSubmit(submissionData);
        
        actions.addNotification({
          type: 'success',
          message: initialData.id ? 'Author updated successfully' : 'Author created successfully'
        });
      } catch (error) {
        actions.addNotification({
          type: 'error',
          message: error.message || 'An error occurred while saving the author'
        });
      }
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
          onBlur={handleBlur}
          error={errors.firstName}
          data-error={Boolean(errors.firstName)}
          required
        />
        
        <Input
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          data-error={Boolean(errors.lastName)}
          required
        />
      </div>
      
      <Input
        name="birthDate"
        label="Birth Date"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.birthDate}
        data-error={Boolean(errors.birthDate)}
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
          onBlur={handleBlur}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white text-gray-900"
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