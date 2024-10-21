import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    organizationCode: '' // Adding organization code field
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showErrorMessage,setShowErrorMessage] = useState(false);
  const [backendErrorMessage, setBackendErrorMessage] = useState('');

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name,value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'firstName':
        if (!/^[A-Za-z]+$/.test(value)) {
          newErrors.firstName = 'Must contain only letters.';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!/^[A-Za-z]+$/.test(value)) {
          newErrors.lastName = 'Must contain only letters.';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'username':
        if (value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters.';
        } else {
          delete newErrors.username;
          checkUsernameAvailability(value);
        }
        break;

      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Invalid email format.';
        } else {
          delete newErrors.email;
          checkEmailAvailability(value);
        }
        break;
      
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters.';
        } else {
          delete newErrors.password;
        }
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match.';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      
      case 'phoneNumber':
        if (!/^\d{10}$/.test(value)) {
          newErrors.phoneNumber = 'Phone number must be 10 digits.';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      
      case 'organizationCode':
        if (!/^[A-Za-z0-9]+$/.test(value)) {
          newErrors.organizationCode = 'Organization code must be alphanumeric.';
        } else {
          delete newErrors.organizationCode;
        }
        break;
      
      default:
        break;
    }
    setErrors(newErrors);
  };

  const checkEmailAvailability = debounce(async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/check-email', { email });
      if (response.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email already exists.'
        }));
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    }
  }, 500);

  const checkUsernameAvailability = debounce(async (username) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/check-username', { username });
      if (response.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: 'Username already exists.'
        }));
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
    }
  }, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle signup logic including organization code verification
    // console.log(formData);
    if (Object.keys(errors).length > 0) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      console.log('Signup successful:', response.data);
      navigate('/admin');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
      setBackendErrorMessage(errorMessage);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-box">
        <h1 className="brand-name">CanManage</h1>
        <h2>Sign Up</h2>
        
        <input
          type="text" name="firstName" placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={() => validateField('firstName', formData.firstName)}
          className={errors.firstName ? 'error' : ''}
          required
        />
        {errors.firstName && <p className="warning">{errors.firstName}</p>}
        <input
          type="text" name="lastName" placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={() => validateField('lastName', formData.lastName)}
          className={errors.lastName ? 'error' : ''}
          required
        />
        {errors.lastName && <p className="warning">{errors.lastName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => validateField('email', formData.email)}
  className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <p className="warning">{errors.email}</p>}
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          onBlur={() => validateField('username', formData.username)}
  className={errors.username ? 'error' : ''}
          required
        />
        {errors.username && <p className="warning">{errors.username}</p>}
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => validateField('password', formData.password)}
  className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && <p className="warning">{errors.password}</p>}
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
  className={errors.confirmPassword ? 'error' : ''}
          required
        />
        {errors.confirmPassword && <p className="warning">{errors.confirmPassword}</p>}
        
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={() => validateField('phoneNumber', formData.phoneNumber)}
  className={errors.phoneNumber ? 'error' : ''}
          required
        />
        {errors.phoneNumber && <p className="warning">{errors.phoneNumber}</p>}
        
        {/* Organization code field */}
        <input
          type="text"
          name="organizationCode"
          placeholder="Organization Code"
          value={formData.organizationCode}
          onChange={handleChange}
          onBlur={() => validateField('organizationCode', formData.organizationCode)}
  className={errors.organizationCode ? 'error' : ''}
          required
        />
        {errors.organizationCode && <p className="warning">{errors.organizationCode}</p>}
        
        <button type="submit">Sign Up</button>
        
        {/* {showErrorMessage && (
          <div className="error-message">
            Invalid credentials. Please try again.
          </div>
        )} */}

        {showErrorMessage && backendErrorMessage && (
          <div className="error-message">{backendErrorMessage}</div>
        )}

        <div className="links">
          <Link to="/">Already a user? Log in</Link>
          {/* <Link to="/admin">Bypass Admin</Link> */}
        </div>
      </form>
    </div>
  );
};

export default Signup;


