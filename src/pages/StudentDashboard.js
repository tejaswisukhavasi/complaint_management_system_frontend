import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useComplaint } from '../context/ComplaintContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { complaints, loading, fetchComplaints, createComplaint } = useComplaint();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium'
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    
    files.forEach(file => {
      data.append('attachments', file);
    });

    try {
      await createComplaint(data);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Infrastructure',
        priority: 'Medium'
      });
      setFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Student Dashboard</h1>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: 'var(--gray)' }}>
              <span>👤 <strong>{user.name}</strong></span>
              {user.studentId && (
                <span>🎓 <strong>ID:</strong> {user.studentId}</span>
              )}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + New Complaint
          </button>
        </motion.div>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>📊</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Complaints</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: '#dbeafe' }}>🔄</div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
            <div className="stat-info">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="complaints-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2>My Complaints</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <p>No complaints yet. Create your first complaint!</p>
            </div>
          ) : (
            <div className="complaints-grid">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id}
                  className="complaint-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="complaint-header">
                    <h3>{complaint.title}</h3>
                    <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="complaint-description">{complaint.description}</p>
                  <div className="complaint-meta">
                    <span className={`badge badge-${complaint.priority.toLowerCase()}`}>
                      {complaint.priority}
                    </span>
                    <span className="complaint-category">{complaint.category}</span>
                    <span className="complaint-date">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {complaint.attachments && complaint.attachments.length > 0 && (
                    <div className="complaint-attachments">
                      <strong>📎 Attachments:</strong>
                      <div className="attachments-list">
                        {complaint.attachments.map((file, idx) => {
                          const isImage = file.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                          return (
                            <button
                              key={idx}
                              onClick={() => isImage ? setPreviewImage(file.path) : window.open(file.path, '_blank')}
                              className="attachment-link"
                              type="button"
                            >
                              {isImage ? '🖼️' : '📄'} {file.filename || `Attachment ${idx + 1}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {complaint.feedback && (
                    <div className="complaint-feedback">
                      <strong>Feedback:</strong> {complaint.feedback}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-preview-close" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="📝 Submit New Complaint">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label>Complaint Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g., Broken AC in Classroom 301"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Please describe your complaint in detail. Include when it started, how it affects you, and any other relevant information..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Infrastructure">🏢 Infrastructure</option>
                  <option value="Academic">📚 Academic</option>
                  <option value="Hostel">🏠 Hostel</option>
                  <option value="Transport">🚌 Transport</option>
                  <option value="Library">📖 Library</option>
                  <option value="Canteen">🍽️ Canteen</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label className="optional">Attachments</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
              {files.length > 0 && (
                <div className="file-info">
                  {files.length} file(s) selected
                </div>
              )}
              <small style={{ display: 'block', marginTop: '8px', color: 'var(--gray)', fontSize: '12px' }}>
                Supported: Images, PDF, Word documents (Max 5MB each)
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Submitting...' : '✓ Submit Complaint'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
