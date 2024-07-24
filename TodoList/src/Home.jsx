import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillTrashFill, BsPencilFill } from 'react-icons/bs';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTask, setEditTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleAdd = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const handleEdit = (id) => {
    setEditMode(id);
    const todo = todos.find(todo => todo._id === id);
    if (todo) setEditTask(todo.task);
  }

  const handleSave = (id) => {
    axios.put(`http://localhost:3001/update/${id}`, { task: editTask })
      .then(result => {
        setTodos(todos.map(todo => (todo._id === id ? result.data : todo)));
        setEditMode(null);
        setEditTask('');
      })
      .catch(err => console.log(err));
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.log(err));
  }

  return (
    <div className='home p-4'>
      <h2 className='text-2xl font-bold mb-4'>Todo List</h2>
      <Create onAdd={handleAdd} />
      {
        todos.length === 0
          ? <div className='text-gray-500'>No Record</div>
          : todos.map((todo, index) => (
            <div key={index} className="task flex items-center p-4 border-b border-gray-200 bg-black text-white rounded">
              <BsCircleFill
                className='text-white mr-2'
                style={{ fontSize: '1.25rem' }} onClick={() => handleEdit(todo._id)}
              />
              {editMode === todo._id ? (
                <>
                  <input 
                    type="text" 
                    value={editTask} 
                    onChange={(e) => setEditTask(e.target.value)} 
                    className='mr-2 p-1'
                  />
                  <button 
                    onClick={() => handleSave(todo._id)} 
                    className='text-white hover:text-green-500 mr-2'
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className='task-text'>{todo.task}</p>
                  <button 
                    className='text-white hover:text-red-500 mr-2' 
                    onClick={() => handleDelete(todo._id)}
                  >
                    <BsFillTrashFill className='text-xl' />
                  </button>
                  <button 
                    className='text-white hover:text-blue-500' 
                    onClick={() => handleEdit(todo._id)}
                  >
                    <BsPencilFill className='text-xl' />
                  </button>
                </>
              )}
            </div>
          ))
      }
    </div>
  );
}

export default Home;
