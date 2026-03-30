import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/apiError';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await taskApi.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load tasks'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    try {
      const response = await taskApi.createTask(formData);
      setTasks([...tasks, response.data]);
      setFormData({ title: '', description: '', completed: false });
      setShowForm(false);
      setError('');
      setSuccessMessage('Task created successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create task'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    try {
      const response = await taskApi.updateTask(editingTask.id, formData);
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? response.data : task))
      );
      setFormData({ title: '', description: '', completed: false });
      setEditingTask(null);
      setShowForm(false);
      setError('');
      setSuccessMessage('Task updated successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update task'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setError('');
      setSuccessMessage('Task deleted successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete task'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    try {
      const response = await taskApi.updateTask(taskId, {
        ...task,
        completed: !task.completed,
      });
      setTasks(
        tasks.map((t) => (t.id === taskId ? response.data : t))
      );
      setSuccessMessage(
        response.data.completed ? 'Task marked as completed.' : 'Task marked as pending.'
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update task'));
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    });
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', completed: false });
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📋 My Tasks</h1>
        <p>Welcome back, {user?.username}!</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-add-task">
          ➕ Add New Task
        </button>
      )}

      {showForm && (
        <div className="task-form-container">
          <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter task title"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter task description (optional)"
                disabled={loading}
                rows="4"
              />
            </div>

            <div className="form-group checkbox">
              <input
                id="completed"
                type="checkbox"
                checked={formData.completed}
                onChange={(e) =>
                  setFormData({ ...formData, completed: e.target.checked })
                }
                disabled={loading}
              />
              <label htmlFor="completed">Mark as completed</label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Saving...'
                  : editingTask
                  ? 'Update Task'
                  : 'Create Task'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-container">
        {loading && !tasks.length && <p className="loading">Loading tasks...</p>}

        {!loading && tasks.length === 0 && !showForm && (
          <p className="no-tasks">No tasks yet. Create one to get started! 🚀</p>
        )}

        {tasks.length > 0 && (
          <>
            <p className="task-count">
              Total: {tasks.length} | Completed: {tasks.filter((t) => t.completed).length}
            </p>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
