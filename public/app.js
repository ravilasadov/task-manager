const API_URL = '/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks on page load
window.addEventListener('DOMContentLoaded', loadTasks);

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    addTaskToDOM(newTask, true); // add to top
    taskInput.value = '';
  } catch (err) {
    console.error('Failed to add task:', err);
  }
});

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    tasks.forEach(task => addTaskToDOM(task, false)); // load in order
  } catch (err) {
    console.error('Failed to load tasks:', err);
  }
}

function addTaskToDOM(task, addToTop = true) {
  const li = document.createElement('li');
  li.dataset.id = task._id;
  if (task.completed) li.classList.add('completed');

  const textSpan = document.createElement('span');
  textSpan.textContent = task.title;

  const buttonGroup = document.createElement('div');

  // ✅ Toggle complete button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = task.completed ? '↩' : '✅';
  toggleBtn.addEventListener('click', () => toggleComplete(task));

  // ✏️ Edit title button
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => startEditTask(task, li));

  // 🗑 Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.addEventListener('click', () => deleteTask(task._id, li));

  buttonGroup.appendChild(toggleBtn);
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  li.appendChild(textSpan);
  li.appendChild(buttonGroup);

  if (addToTop) {
    taskList.prepend(li);
  } else {
    taskList.appendChild(li);
  }
}

// 🗑 Delete a task from the server and UI
async function deleteTask(id, liElement) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      liElement.remove();
    } else {
      console.error('Failed to delete task');
    }
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}

// ✅↩ Toggle a task's completed status
async function toggleComplete(task) {
  try {
    const updated = {
      completed: !task.completed,
    };

    const res = await fetch(`${API_URL}/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      const li = document.querySelector(`li[data-id="${task._id}"]`);
      if (li) {
        li.classList.toggle('completed');

        // Update toggle icon
        const buttons = li.querySelectorAll('button');
        const toggleBtn = buttons[0];
        toggleBtn.textContent = updatedTask.completed ? '↩' : '✅';
      }
    }
  } catch (err) {
    console.error('Error toggling task:', err);
  }
}

// ✏️ Inline edit task title
function startEditTask(task, liElement) {
  const originalSpan = liElement.querySelector('span');
  const originalText = originalSpan.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  input.classList.add('edit-input');

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const newTitle = input.value.trim();
      if (!newTitle || newTitle === originalText) {
        liElement.replaceChild(originalSpan, input);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/${task._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });

        if (res.ok) {
          const updatedTask = await res.json();
          const newSpan = document.createElement('span');
          newSpan.textContent = updatedTask.title;
          liElement.replaceChild(newSpan, input);
        }
      } catch (err) {
        console.error('Error updating task title:', err);
      }
    } else if (e.key === 'Escape') {
      liElement.replaceChild(originalSpan, input);
    }
  });

  liElement.replaceChild(input, originalSpan);
  input.focus();
}
