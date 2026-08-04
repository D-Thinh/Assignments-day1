const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const dataInput = $("#todo-input");
const addTodo = $("#add-btn");
const todoList = $("#todo-list");
const todoItems = $$(".todo--item");
const todoCount = $("#todo-count");

function updateTodoCount() {
    const todoCount_Done = $$(".completed");
    const todoCount = todoList.childElementCount - todoCount_Done.length;
    return `Còn ${todoCount} việc chưa xong`;
}

dataInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTodo.click();
    }
});

addTodo.onclick = function () {
    const data = $("#todo-input");
    console.log(data.value);

    if (data.value.trim() !== "" && handelDoublicateTodoy(data)) {
        const todoItem = createTodoItem(data.value);
        todoList.appendChild(todoItem);

        data.value = "";
        todoCount.textContent = updateTodoCount();
    }
};

function handelDoublicateTodoy(value) {
    const todoContent = $$(".todo-text");
    for (const todo of todoContent) {
        if (todo.textContent === value.value.trim()) {
            value.classList.add("input-error");

            setTimeout(() => {
                value.classList.remove("input-error");
            }, 1000);
            value.value = "";
            return false;
        }
    }
    return true;
}

function createTodoItem(text) {
    const todoItem = document.createElement("li");
    todoItem.className = "todo--item";

    const todoText = document.createElement("p");
    todoText.className = "todo-text";
    todoText.textContent = text;

    const todoButton = document.createElement("button");
    todoButton.className = "delete-btn";
    todoButton.textContent = "Xóa";

    todoItem.append(todoText, todoButton);

    return todoItem;
}

todoList.addEventListener("click", function (e) {
    if (e.target.closest(".delete-btn")) {
        todoList.removeChild(e.target.closest(".todo--item"));
        todoCount.textContent = updateTodoCount();
    }
    const item = e.target.closest(".todo--item");
    if (item) {
        item.classList.toggle("completed");
        todoCount.textContent = updateTodoCount();
    }
});
