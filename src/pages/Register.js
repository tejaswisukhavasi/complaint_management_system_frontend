import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    department: '',
    phone: '',
    registrationKey: ''
  });
  const [showKeyField, setShowKeyField] = useState(false);
  const [showStudentId, setShowStudentId] = useState(true);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Show/hide fields based on role
    if (name === 'role') {
      setShowKeyField(value === 'admin' || value === 'staff');
      setShowStudentId(value === 'student');
      
      if (value === 'student') {
        setFormData(prev => ({ ...prev, registrationKey: '' }));
      } else {
        setFormData(prev => ({ ...prev, studentId: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      navigate(`/${user.role}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1>🎓 Create Account</h1>
          <p>Register to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {showStudentId && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label>Student ID / Registration Number 🎓</label>
              <input
                type="text"
                name="studentId"
                className="form-control"
                placeholder="Enter your student ID (e.g., 2024CS001)"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
              <small style={{ display: 'block', marginTop: '8px', color: 'var(--gray)', fontSize: '12px' }}>
                Your unique student identification number
              </small>
            </motion.div>
          )}

          {showKeyField && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label>
                {formData.role === 'admin' ? 'Admin' : 'Staff'} Registration Key 🔑
              </label>
              <input
                type="password"
                name="registrationKey"
                className="form-control"
                placeholder={`Enter ${formData.role} registration key`}
                value={formData.registrationKey}
                onChange={handleChange}
                required
              />
              <small style={{ display: 'block', marginTop: '8px', color: 'var(--gray)', fontSize: '12px' }}>
                Contact administrator for the registration key
              </small>
            </motion.div>
          )}

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              className="form-control"
              placeholder="Enter your department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login">Login here</Link>
        </div>

        <div className="auth-footer" style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <Link to="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
