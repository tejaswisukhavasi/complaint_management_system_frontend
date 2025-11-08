import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📝',
      title: 'Easy Complaint Submission',
      description: 'Submit complaints quickly with file attachments and track their status in real-time'
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Separate dashboards for Students, Staff, and Administrators with specific permissions'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics and insights for administrators to track complaint trends'
    },
    {
      icon: '🔔',
      title: 'Real-Time Updates',
      description: 'Get instant notifications when your complaint status changes or receives feedback'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security and encryption'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Access from any device - desktop, tablet, or mobile with seamless experience'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="hero-title">
              🎓 Complaint Management System
            </h1>
            <p className="hero-subtitle">
              Streamline Your College Complaint Resolution Process
            </p>
            <p className="hero-description">
              A modern, efficient platform for students, staff, and administrators to manage 
              and resolve complaints seamlessly. Track, assign, and resolve issues with ease.
            </p>
            <div className="hero-buttons">
              <motion.button
                className="btn btn-primary btn-large"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started →
              </motion.button>
              <motion.button
                className="btn btn-outline btn-large"
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="hero-card-content">
                <div className="stat-item">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <div className="stat-value">1,234</div>
                    <div className="stat-label">Complaints Resolved</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-info">
                    <div className="stat-value">2.5 Days</div>
                    <div className="stat-label">Avg Resolution Time</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">😊</div>
                  <div className="stat-info">
                    <div className="stat-value">95%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Why Choose Our System?</h2>
          <p className="section-subtitle">
            Everything you need to manage complaints efficiently
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-description">
          Join hundreds of institutions using our platform to improve their complaint management
        </p>
        <div className="cta-buttons">
          <motion.button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Free Account
          </motion.button>
          <motion.button
            className="btn btn-outline-white btn-large"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 Complaint Management System. Built with ❤️ using MERN Stack</p>
      </footer>
    </div>
  );
};

export default LandingPage;
