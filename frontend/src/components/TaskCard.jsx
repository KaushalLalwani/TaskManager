import './TaskCard.css';

export const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <span className="task-date">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </span>
        <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
      
      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn-edit">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="btn-delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};
