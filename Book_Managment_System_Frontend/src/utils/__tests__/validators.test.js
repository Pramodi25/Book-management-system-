import {
  required,
  minLength,
  maxLength,
  isNumber,
  isDate,
  isUrl,
  isEmail,
  isIsbn,
  validateForm,
  compose
} from '../validators';

describe('Validator Functions', () => {
  describe('required', () => {
    it('should return undefined for non-empty values', () => {
      expect(required()('test')).toBeUndefined();
      expect(required()('0')).toBeUndefined();
      expect(required()(0)).toBeUndefined();
      expect(required()(false)).toBeUndefined();
    });

    it('should return error message for empty values', () => {
      expect(required()('')).toBe('This field is required');
      expect(required()(null)).toBe('This field is required');
      expect(required()(undefined)).toBe('This field is required');
    });

    it('should use custom error message when provided', () => {
      expect(required('Custom message')('')).toBe('Custom message');
    });
  });

  describe('minLength', () => {
    it('should return undefined when value length is >= min', () => {
      expect(minLength(3)('test')).toBeUndefined();
      expect(minLength(4)('test')).toBeUndefined();
      expect(minLength(0)('')).toBeUndefined();
    });

    it('should return error message when value length is < min', () => {
      expect(minLength(5)('test')).toBe('Must be at least 5 characters');
      expect(minLength(1)('')).toBe('Must be at least 1 character');
    });

    it('should use custom error message when provided', () => {
      expect(minLength(5, 'Too short')('test')).toBe('Too short');
    });

    it('should handle non-string values', () => {
      expect(minLength(3)(123)).toBeUndefined(); // "123" has length 3
      expect(minLength(4)(123)).toBe('Must be at least 4 characters');
      expect(minLength(1)(null)).toBe('Must be at least 1 character');
    });
  });

  describe('maxLength', () => {
    it('should return undefined when value length is <= max', () => {
      expect(maxLength(5)('test')).toBeUndefined();
      expect(maxLength(4)('test')).toBeUndefined();
      expect(maxLength(0)('')).toBeUndefined();
    });

    it('should return error message when value length is > max', () => {
      expect(maxLength(3)('test')).toBe('Must not exceed 3 characters');
    });

    it('should use custom error message when provided', () => {
      expect(maxLength(3, 'Too long')('test')).toBe('Too long');
    });
  });

  describe('isNumber', () => {
    it('should return undefined for valid numbers', () => {
      expect(isNumber()(42)).toBeUndefined();
      expect(isNumber()('42')).toBeUndefined();
      expect(isNumber()(-3.14)).toBeUndefined();
      expect(isNumber()('3.14')).toBeUndefined();
    });

    it('should return error message for non-numbers', () => {
      expect(isNumber()('abc')).toBe('Must be a valid number');
      expect(isNumber()(null)).toBe('Must be a valid number');
      expect(isNumber()(undefined)).toBe('Must be a valid number');
      expect(isNumber()('123abc')).toBe('Must be a valid number');
    });

    it('should validate min constraint', () => {
      const validator = isNumber({ min: 5 });
      expect(validator(10)).toBeUndefined();
      expect(validator(5)).toBeUndefined();
      expect(validator(4)).toBe('Must be at least 5');
    });

    it('should validate max constraint', () => {
      const validator = isNumber({ max: 10 });
      expect(validator(5)).toBeUndefined();
      expect(validator(10)).toBeUndefined();
      expect(validator(11)).toBe('Must not exceed 10');
    });

    it('should validate integer constraint', () => {
      const validator = isNumber({ integer: true });
      expect(validator(5)).toBeUndefined();
      expect(validator('42')).toBeUndefined();
      expect(validator(3.14)).toBe('Must be a whole number');
    });
  });

  describe('isDate', () => {
    it('should return undefined for valid dates', () => {
      expect(isDate()('2023-05-17')).toBeUndefined();
      expect(isDate()(new Date())).toBeUndefined();
    });

    it('should return error message for invalid dates', () => {
      expect(isDate()('not-a-date')).toBe('Must be a valid date');
      expect(isDate()(null)).toBe('Must be a valid date');
      expect(isDate()('2023-13-45')).toBe('Must be a valid date');
    });

    it('should validate min constraint', () => {
      const minDate = new Date('2023-01-01');
      const validator = isDate({ min: minDate });
      expect(validator('2023-02-01')).toBeUndefined();
      expect(validator('2022-12-31')).toBe(`Must be on or after ${minDate.toLocaleDateString()}`);
    });

    it('should validate max constraint', () => {
      const maxDate = new Date('2023-12-31');
      const validator = isDate({ max: maxDate });
      expect(validator('2023-11-30')).toBeUndefined();
      expect(validator('2024-01-01')).toBe(`Must be on or before ${maxDate.toLocaleDateString()}`);
    });
  });

  describe('isUrl', () => {
    it('should return undefined for valid URLs', () => {
      expect(isUrl()('https://example.com')).toBeUndefined();
      expect(isUrl()('http://localhost:3000')).toBeUndefined();
      expect(isUrl()('https://sub.domain.co.uk/path?query=123')).toBeUndefined();
    });

    it('should return error message for invalid URLs', () => {
      expect(isUrl()('not-a-url')).toBe('Must be a valid URL');
      expect(isUrl()('example.com')).toBe('Must be a valid URL');
      expect(isUrl()(null)).toBe('Must be a valid URL');
    });

    it('should use custom error message when provided', () => {
      expect(isUrl('Invalid URL format')('not-a-url')).toBe('Invalid URL format');
    });
  });

  describe('isEmail', () => {
    it('should return undefined for valid emails', () => {
      expect(isEmail()('user@example.com')).toBeUndefined();
      expect(isEmail()('first.last@domain.co.uk')).toBeUndefined();
      expect(isEmail()('name+tag@gmail.com')).toBeUndefined();
    });

    it('should return error message for invalid emails', () => {
      expect(isEmail()('not-an-email')).toBe('Must be a valid email address');
      expect(isEmail()('user@')).toBe('Must be a valid email address');
      expect(isEmail()('@domain.com')).toBe('Must be a valid email address');
      expect(isEmail()(null)).toBe('Must be a valid email address');
    });
  });

  describe('isIsbn', () => {
    it('should return undefined for valid ISBN-10', () => {
      expect(isIsbn()('0-306-40615-2')).toBeUndefined();
      expect(isIsbn()('0306406152')).toBeUndefined();
    });

    it('should return undefined for valid ISBN-13', () => {
      expect(isIsbn()('978-0-306-40615-7')).toBeUndefined();
      expect(isIsbn()('9780306406157')).toBeUndefined();
    });

    it('should return error message for invalid ISBNs', () => {
      expect(isIsbn()('not-an-isbn')).toBe('Must be a valid ISBN (10 or 13 digits)');
      expect(isIsbn()('123456789')).toBe('Must be a valid ISBN (10 or 13 digits)');
      expect(isIsbn()('9780306406158')).toBe('Must be a valid ISBN (10 or 13 digits)');
      expect(isIsbn()(null)).toBe('Must be a valid ISBN (10 or 13 digits)');
    });
  });

  describe('compose', () => {
    it('should run multiple validators and return first error', () => {
      const validator = compose([
        required('Required field'),
        minLength(5, 'Min 5 chars'),
        maxLength(10, 'Max 10 chars')
      ]);

      expect(validator('')).toBe('Required field');
      expect(validator('abc')).toBe('Min 5 chars');
      expect(validator('abcdefghijk')).toBe('Max 10 chars');
      expect(validator('abcdef')).toBeUndefined();
    });

    it('should handle single validator in array', () => {
      const validator = compose([required('Required')]);
      expect(validator('')).toBe('Required');
      expect(validator('value')).toBeUndefined();
    });

    it('should return undefined when no validators provided', () => {
      const validator = compose([]);
      expect(validator('anything')).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    it('should validate all form fields according to schema', () => {
      const formData = {
        name: '',
        email: 'invalid',
        age: 15,
        description: 'OK'
      };

      const schema = {
        name: required('Name required'),
        email: isEmail(),
        age: isNumber({ min: 18, message: 'Must be 18+' }),
        description: [required(), minLength(2)]
      };

      const errors = validateForm(formData, schema);
      expect(errors).toEqual({
        name: 'Name required',
        email: 'Must be a valid email address',
        age: 'Must be 18+'
      });
      expect(errors.description).toBeUndefined();
    });

    it('should return empty object when all validations pass', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      };

      const schema = {
        name: required(),
        email: isEmail(),
        age: isNumber({ min: 18 })
      };

      const errors = validateForm(formData, schema);
      expect(errors).toEqual({});
    });

    it('should ignore fields not in schema', () => {
      const formData = {
        name: '',
        extra: 'something'
      };

      const schema = {
        name: required()
      };

      const errors = validateForm(formData, schema);
      expect(errors).toEqual({ name: 'This field is required' });
      expect(errors.extra).toBeUndefined();
    });
  });
});
