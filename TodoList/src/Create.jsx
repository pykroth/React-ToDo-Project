import React, { useState } from 'react';
import axios from 'axios';

function Create({ onAdd }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!task) {
      return; // Optionally show an error if task is empty
    }

    axios.post('http://localhost:3001/add', { task })
      .then(result => {
        setTask('');
        onAdd(result.data); // Notify parent component of the new todo
      })
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}

export default Create;
