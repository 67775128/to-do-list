import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState(() => {
    // 从 localStorage 获取保存的待办事项
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all'); // 添加过滤状态：'all', 'active', 'completed'

  // 当 todos 变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (id) => {
    if (editValue.trim() !== '') {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: editValue } : todo
      ));
      setEditingId(null);
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // 根据过滤条件筛选待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <h1>todos</h1>
      <div className="todo-app">
        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button onClick={handleAddTodo} className="add-button">添加</button>
        </div>
        
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                className="todo-checkbox"
              />
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  onBlur={() => handleEditSubmit(todo.id)}
                  onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                  className="edit-input"
                  autoFocus
                />
              ) : (
                <span 
                  className="todo-text"
                  onDoubleClick={() => handleEdit(todo.id, todo.text)}
                >
                  {todo.text}
                </span>
              )}
              <button 
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        
        {todos.length > 0 && (
          <div className="todo-footer">
            <span>{todos.filter(todo => !todo.completed).length} 项待办</span>
            
            <div className="filters">
              <button 
                className={`filter-btn ${filter === 'all' ? 'selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                全部
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'selected' : ''}`}
                onClick={() => setFilter('active')}
              >
                未完成
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'selected' : ''}`}
                onClick={() => setFilter('completed')}
              >
                已完成
              </button>
            </div>
            
            {todos.some(todo => todo.completed) && (
              <button 
                onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                className="clear-completed"
              >
                清除已完成
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;