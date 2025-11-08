import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useComplaint } from '../context/ComplaintContext';
import './StudentDashboard.css';

const StaffDashboard = () => {
  const { complaints, loading, fetchComplaints, updateComplaint } = useComplaint();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    feedback: ''
  });
  const [updating, setUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateClick = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateData({
      status: complaint.status,
      feedback: complaint.feedback || ''
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateComplaint(selectedComplaint._id, updateData);
      setIsModalOpen(false);
      setSelectedComplaint(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
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

      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-preview-close" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
      
      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Staff Dashboard</h1>
        </motion.div>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>📋</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Assigned Complaints</p>
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
          <h2>Assigned Complaints</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <p>No complaints assigned yet.</p>
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
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--gray)' }}>
                    <div><strong>Student:</strong> {complaint.student?.name}</div>
                    {complaint.student?.studentId && (
                      <div><strong>Student ID:</strong> {complaint.student.studentId}</div>
                    )}
                    <div><strong>Email:</strong> {complaint.student?.email}</div>
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
                      <strong>Your Feedback:</strong> {complaint.feedback}
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => handleUpdateClick(complaint)}
                  >
                    Update Status
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="🔄 Update Complaint Status">
        {selectedComplaint && (
          <form onSubmit={handleUpdate}>
            <div className="form-section">
              <div style={{ background: 'var(--light)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--dark)' }}>
                  {selectedComplaint.title}
                </h4>
                <p style={{ margin: '0', fontSize: '13px', color: 'var(--gray)' }}>
                  Submitted by: {selectedComplaint.student?.name}
                </p>
              </div>

              <div className="form-group">
                <label>Update Status</label>
                <select
                  className="form-control"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Resolved">✅ Resolved</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Feedback to Student</label>
                <textarea
                  className="form-control"
                  placeholder="Provide detailed feedback about the complaint status, actions taken, or reasons for the decision..."
                  value={updateData.feedback}
                  onChange={(e) => setUpdateData({ ...updateData, feedback: e.target.value })}
                  rows="6"
                />
                <small style={{ display: 'block', marginTop: '8px', color: 'var(--gray)', fontSize: '12px' }}>
                  This feedback will be visible to the student
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? '⏳ Updating...' : '✓ Update Complaint'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StaffDashboard;
