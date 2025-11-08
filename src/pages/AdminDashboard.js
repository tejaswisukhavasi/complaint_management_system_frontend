import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useComplaint } from '../context/ComplaintContext';
import './AdminDashboard.css';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

const AdminDashboard = () => {
  const { complaints, loading, fetchComplaints, updateComplaint, deleteComplaint } = useComplaint();
  const [analytics, setAnalytics] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    assignedTo: '',
    priority: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/analytics/dashboard');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get('/api/users/staff');
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff', error);
    }
  };

  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setAssignData({
      assignedTo: complaint.assignedTo?._id || '',
      priority: complaint.priority
    });
    setIsModalOpen(true);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await updateComplaint(selectedComplaint._id, assignData);
      setIsModalOpen(false);
      setSelectedComplaint(null);
      fetchAnalytics();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      await deleteComplaint(id);
      fetchAnalytics();
    }
  };

  const statusData = analytics?.statusBreakdown?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const categoryData = analytics?.categoryBreakdown?.map(item => ({
    name: item._id,
    count: item.count
  })) || [];

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
          <h1>Admin Dashboard</h1>
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
              <h3>{analytics?.totalComplaints || 0}</h3>
              <p>Total Complaints</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
            <div className="stat-info">
              <h3>{analytics?.totalStudents || 0}</h3>
              <p>Students</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: '#fef3c7' }}>👨‍💼</div>
            <div className="stat-info">
              <h3>{analytics?.totalStaff || 0}</h3>
              <p>Staff Members</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon" style={{ background: '#d1fae5' }}>⏱️</div>
            <div className="stat-info">
              <h3>{analytics?.avgResolutionTime || 0}</h3>
              <p>Avg Resolution (days)</p>
            </div>
          </motion.div>
        </div>

        <div className="charts-grid">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          className="complaints-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2>All Complaints</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <p>No complaints in the system.</p>
            </div>
          ) : (
            <div className="complaints-grid">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id}
                  className="complaint-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                    {complaint.assignedTo && (
                      <div><strong>Assigned to:</strong> {complaint.assignedTo.name}</div>
                    )}
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
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => handleAssignClick(complaint)}
                    >
                      Assign/Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(complaint._id)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="👨‍💼 Assign Complaint">
        {selectedComplaint && (
          <form onSubmit={handleAssign}>
            <div className="form-section">
              <div style={{ background: 'var(--light)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--dark)' }}>
                  {selectedComplaint.title}
                </h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--gray)' }}>
                  Category: {selectedComplaint.category}
                </p>
                <p style={{ margin: '0', fontSize: '13px', color: 'var(--gray)' }}>
                  Student: {selectedComplaint.student?.name}
                  {selectedComplaint.student?.studentId && ` (ID: ${selectedComplaint.student.studentId})`}
                </p>
              </div>

              <div className="form-group">
                <label>Assign to Staff Member</label>
                <select
                  className="form-control"
                  value={assignData.assignedTo}
                  onChange={(e) => setAssignData({ ...assignData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">-- Select Staff Member --</option>
                  {staff.map(s => (
                    <option key={s._id} value={s._id}>
                      👤 {s.name} - {s.department}
                    </option>
                  ))}
                </select>
                <small style={{ display: 'block', marginTop: '8px', color: 'var(--gray)', fontSize: '12px' }}>
                  The selected staff member will be notified
                </small>
              </div>

              <div className="form-group">
                <label>Set Priority Level</label>
                <select
                  className="form-control"
                  value={assignData.priority}
                  onChange={(e) => setAssignData({ ...assignData, priority: e.target.value })}
                >
                  <option value="Low">🟢 Low Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="High">🔴 High Priority</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                ✓ Assign Complaint
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
