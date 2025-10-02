import React, { useState } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const addTask = () => {
        if (inputValue.trim()) {
            const newTask = {
                id: Date.now(),
                text: inputValue.trim()
            };
            setTasks([...tasks, newTask]);
            setInputValue('');
        }
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const startEdit = (id, text) => {
        setEditingId(id);
        setEditValue(text);
    };

    const saveEdit = (id) => {
        if (editValue.trim()) {
            setTasks(tasks.map(task =>
                task.id === id ? { ...task, text: editValue.trim() } : task
            ));
        }
        setEditingId(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    const handleEditKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            saveEdit(id);
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    return (
        <div className="app">
            <div className="container">
                <h1>Get Things Done !</h1>

                <div className="input-section">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What is the task today?"
                        className="task-input"
                    />
                    <button onClick={addTask} className="add-btn">
                        Add Task
                    </button>
                </div>

                <div className="tasks-list">
                    {tasks.map(task => (
                        <div key={task.id} className="task-item">
                            {editingId === task.id ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                                    onBlur={() => saveEdit(task.id)}
                                    className="edit-input"
                                    autoFocus
                                />
                            ) : (
                                <span className="task-text">{task.text}</span>
                            )}

                            <div className="task-actions">
                                <button
                                    onClick={() => startEdit(task.id, task.text)}
                                    className="edit-btn"
                                    title="Edit task"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="delete-btn"
                                    title="Delete task"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {tasks.length === 0 && (
                    <div className="empty-state">
                        No tasks yet. Add one above to get started!
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;