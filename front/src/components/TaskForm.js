import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const TaskForm = ({ userId, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`https://finzarc-api.vercel.app/api/tasks`, {
        ...formData,
        userId
      });
      
      // Clear form after successful submission
      setFormData({ title: '', description: '' });
      
      // Notify parent component 
      if (onTaskAdded) {
        onTaskAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task To Finzarc </h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 