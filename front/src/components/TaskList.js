import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const TaskList = ({ userId, taskUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewTask, setViewTask] = useState(null);

  // Fetch tasks when component mounts, userId changes, or tasks are updated
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://finzarc-api.vercel.app/api/tasks/${userId}`);
        setTasks(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch tasks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId, taskUpdated]);

  // Mark task as complete
  const handleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const response = await axios.put(`https://finzarc-api.vercel.app/api/tasks/${taskId}`, {
        completed: !task.completed
      });

      // Update task in the list
      setTasks(tasks.map(t => 
        t._id === taskId ? response.data : t
      ));
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://finzarc-api.vercel.app/api/tasks/${taskId}`);
      
      // Remove task from the list
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  // View task details
  const handleView = (task) => {
    setViewTask(task);
  };

  // Close modal
  const closeModal = () => {
    setViewTask(null);
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <h2>Your Tasks</h2>
      {error && <div className="error-message">{error}</div>}
      
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Add a new task above!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <span className="task-date">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="task-actions">
                <button 
                  onClick={() => handleView(task)}
                  className="btn-view"
                >
                  View
                </button>
                <button 
                  onClick={() => handleComplete(task._id)}
                  className={`btn-complete ${task.completed ? 'btn-undo' : ''}`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button 
                  onClick={() => handleDelete(task._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Task View Modal */}
      {viewTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewTask.title}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="task-details">
                <div className="detail-row">
                  <strong>Description:</strong>
                  <p>{viewTask.description || "No description provided"}</p>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span className={viewTask.completed ? "status-completed" : "status-pending"}>
                    {viewTask.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Created:</strong>
                  <span>{new Date(viewTask.createdAt).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <strong>Last Updated:</strong>
                  <span>{new Date(viewTask.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 