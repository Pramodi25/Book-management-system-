import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAppContext } from '../../contexts/AppContext';
import { 
  required, 
  minLength, 
  isNumber, 
  isUrl,
  validateForm 
} from '../../utils/validators';

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

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const { actions } = useAppContext();

  // Validation schema
  const validationSchema = {
    name: [
      required('Publisher name is required'),
      minLength(2, 'Publisher name must be at least 2 characters')
    ],
    website: isUrl('Please enter a valid URL'),
    foundedYear: isNumber({
      min: 1400,
      max: new Date().getFullYear(),
      integer: true,
      message: `Founded year must be between 1400 and ${new Date().getFullYear()}`
    })
  };

  // Update form when initialData changes (edit mode)
  useEffect(() => {
    if (Object.keys(initialData).length) {
      setFormData({ ...initialData });
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

  const validatePublisherForm = () => {
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
    
    if (validatePublisherForm()) {
      try {
        onSubmit(formData);
        
        actions.addNotification({
          type: 'success',
          message: initialData.id ? 'Publisher updated successfully' : 'Publisher created successfully'
        });
      } catch (error) {
        actions.addNotification({
          type: 'error',
          message: error.message || 'An error occurred while saving the publisher'
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
      <Input
        name="name"
        label="Publisher Name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        data-error={Boolean(errors.name)}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="location"
          label="Location"
          value={formData.location || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.location}
          data-error={Boolean(errors.location)}
        />
        
        <Input
          name="foundedYear"
          label="Founded Year"
          type="number"
          value={formData.foundedYear || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.foundedYear}
          data-error={Boolean(errors.foundedYear)}
        />
      </div>
      
      <Input
        name="website"
        label="Website"
        type="url"
        value={formData.website || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.website}
        data-error={Boolean(errors.website)}
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
          onBlur={handleBlur}
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