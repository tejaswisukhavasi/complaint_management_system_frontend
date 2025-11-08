import React, { createContext, useState, useContext } from 'react';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const ComplaintContext = createContext();

export const useComplaint = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaint must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/complaints');
      setComplaints(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaintData) => {
    try {
      const { data } = await axios.post('/api/complaints', complaintData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setComplaints([data, ...complaints]);
      toast.success('Complaint submitted successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create complaint');
      throw error;
    }
  };

  const updateComplaint = async (id, updates) => {
    try {
      const { data } = await axios.put(`/api/complaints/${id}`, updates);
      setComplaints(complaints.map(c => c._id === id ? data : c));
      toast.success('Complaint updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
      throw error;
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`/api/complaints/${id}`);
      setComplaints(complaints.filter(c => c._id !== id));
      toast.success('Complaint deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
      throw error;
    }
  };

  const value = {
    complaints,
    loading,
    fetchComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};
