const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(idx));
        li.appendChild(checkbox);

        if (task.editing) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = task.text;
            editInput.className = 'edit-input';
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    updateTask(idx, editInput.value);
                }
            });
            li.appendChild(editInput);

            const actions = document.createElement('div');
            actions.className = 'actions';
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => updateTask(idx, editInput.value);
            actions.appendChild(saveBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => cancelEdit(idx);
            actions.appendChild(cancelBtn);

            li.appendChild(actions);
        } else {
            const span = document.createElement('span');
            span.textContent = task.text;
            span.style.cursor = 'pointer';
            li.appendChild(span);

            const actions = document.createElement('div');
            actions.className = 'actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editTask(idx);
            actions.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deleteTask(idx);
            actions.appendChild(delBtn);

            li.appendChild(actions);
        }
        taskList.appendChild(li);
    });
}

function addTask(text) {
    tasks.push({ text, completed: false, editing: false });
    saveTasks();
    renderTasks();
}

function toggleComplete(idx) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(idx) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
}

function editTask(idx) {
    tasks[idx].editing = true;
    renderTasks();
}

function updateTask(idx, newText) {
    if (newText.trim() !== '') {
        tasks[idx].text = newText.trim();
        tasks[idx].editing = false;
        saveTasks();
        renderTasks();
    }
}

function cancelEdit(idx) {
    tasks[idx].editing = false;
    renderTasks();
}

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
    }
});

renderTasks();
