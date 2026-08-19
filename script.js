const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

const addButton = document.getElementById('add-button');
const newTodoInput = document.getElementById('new-todo');

const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');

let editingTodo = null;


function addTodo(text, completed = false) {

    const li = document.createElement("li");

    li.className = "todo-item";

    if (completed) {
        li.classList.add("completed");
    }

    li.innerHTML = `
        <input type="checkbox" ${completed ? "checked" : ""} />

        <label>${text}</label>

        <div class="todo-actions">

            <div class="icon edit-icon">
                <img src="edit.svg" alt="Editar">
            </div>

            <div class="icon delete-icon">
                <img src="delete.svg" alt="Eliminar">
            </div>

        </div>
    `;

    if (completed) {
        completedList.appendChild(li);
    } else {
        todoList.appendChild(li);
    }

    updateProgress();
}



function handleAddButtonClick() {

    const text = newTodoInput.value.trim();

    if (text === "") {
        return;
    }

    if (editingTodo) {

        const label = editingTodo.querySelector("label");

        label.textContent = text;

        editingTodo = null;

        newTodoInput.value = "";

        addButton.innerHTML = `
            <img src="add.svg" alt="Agregar">
        `;

        newTodoInput.placeholder = "¿Qué hay que hacer?";

        return;
    }

    addTodo(text);

    newTodoInput.value = "";
    newTodoInput.focus();
}



function editTodoItem(target) {

    const item = target.closest(".todo-item");
    const label = item.querySelector("label");

    if (editingTodo && editingTodo !== item) {

        const previousLabel =
            editingTodo.querySelector("label");

        previousLabel.textContent =
            editingTodo.dataset.originalText;
    }

    editingTodo = item;

    // Guardamos el texto original
    item.dataset.originalText = label.textContent;

    // Colocamos el texto en el input
    newTodoInput.value = label.textContent;

    newTodoInput.focus();

    // Seleccionamos todo el texto
    newTodoInput.select();

    // Cambiamos el icono + por ✓
    addButton.innerHTML = `
        <span>✓</span>
    `;

    newTodoInput.placeholder = "Editar tarea...";
}


function toggleTodoCompleted(target) {

    const item = target.closest(".todo-item");

    item.classList.toggle("completed");

    if (item.classList.contains("completed")) {
        completedList.appendChild(item);
    } else {
        todoList.appendChild(item);
    }

    updateProgress();
}


function deleteTodoItem(target) {

    const item = target.closest(".todo-item");

    // Si eliminamos la tarea que estamos editando
    if (editingTodo === item) {

        editingTodo = null;

        newTodoInput.value = "";

        addButton.innerHTML = `
            <img src="add.svg" alt="Agregar">
        `;

        newTodoInput.placeholder =
            "¿Qué hay que hacer?";
    }

    item.remove();

    updateProgress();
}


function handleTodoListClick(e) {

    const target = e.target;

    if (target.type === "checkbox") {
        toggleTodoCompleted(target);
    }

    if (target.closest(".edit-icon")) {
        editTodoItem(target);
    }

    if (target.closest(".delete-icon")) {
        deleteTodoItem(target);
    }
}


function updateProgress() {

    const pendingTasks =
        todoList.querySelectorAll(".todo-item").length;

    const completedTasks =
        completedList.querySelectorAll(".todo-item").length;

    const totalTasks =
        pendingTasks + completedTasks;

    const percentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

    progressText.textContent =
        `${pendingTasks} de ${totalTasks} tareas pendientes`;

    progressPercent.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;
}


addButton.addEventListener(
    "click",
    handleAddButtonClick
);


newTodoInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        handleAddButtonClick();
    }

});


todoList.addEventListener(
    "click",
    handleTodoListClick
);


completedList.addEventListener(
    "click",
    handleTodoListClick
);