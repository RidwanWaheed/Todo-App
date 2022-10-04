"use strict";
/********************************
 Select Elements
********************************/
const themeIcon = document.querySelector(".theme");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo__list");
const deleteEl = document.querySelectorAll(".remove");
const allEl = document.querySelector("#all");
const activeEl = document.querySelector("#active");
const completedEl = document.querySelector("#completed");
const clearAllEl = document.querySelector(".clear");
const itemCount = document.querySelector(".count span");
const filters = document.querySelectorAll("input[name='filter");

/********************************
 Set Global Variables
********************************/
let todoArray = [];
let todoId = 0;
let currentFilter = "all";
const LOCAL_TODOS = "local_todos";

/********************************
 START OF INSTRUCTIONS
********************************/

function init() {
  const starterList = [
    "Complete online JavaScript course",
    "Jog around the park 3x",
    "10 minutes meditation",
    "Read for 1 hour",
    "Pick up groceries",
    "Complete Todo App on Frontend Mentor",
  ];

  if (
    localStorage.getItem("isFirstVisit") === null ||
    localStorage.getItem("isFirstVisit") === false
  ) {
    localStorage.setItem("isFirstVisit", true);
    starterList.forEach((item) => {
      addTodoElem(item);
    });
    //    changeActiveStatus(todoArray[0].DOMelem);
  } else {
    getLocalStorage();
  }
}

init();

/********************************
 Functions
********************************/
todoInput.addEventListener("keydown", function (e) {
  //   e.preventDefault();
  if (e.key === "Enter") {
    // get current text from input field
    const newTask = todoInput.value;
    // only add new item to list if some text was entered
    if (newTask != "") {
      addTodoElem(newTask);
      todoInput.value = "";
    }
  }
});

function updateActiveCount() {
  // counts the number of active elements in global array and sets the counts
  let count = todoArray.reduce((count, todoObj) => {
    if (todoObj.active) count++;
    return count;
  }, 0);
  itemCount.innerText = count;
}

function updateCurrentId() {
  // make sure the current ID is up to date after deletion
  if (!todoArray.length) {
    todoId = 0;
  } else {
    todoId = todoArray[todoArray.length - 1].id + 1;
  }
}

function changeActiveStatus(elem) {
  //  toggle the check class on elements and the set active variable in the element array to correct value
  elem.classList.toggle("todo__elem--checked");
  let isActive = true;

  if (elem.classList.contains("todo__elem--checked")) {
    //console.log("contains");
    isActive = false;
  }

  todoArray.forEach((arrayObj) => {
    if (arrayObj.id === +elem.id) arrayObj.active = isActive;
  });

  // reflect changes on the global variable in the localStorage and update active element count
  updateActiveCount();
  updateLocalStorage();
}

function addTodoElem(todoText, isNew = true) {
  //create a todo element and fill the content/text / etc
  const item = document.createElement("li");
  item.id = "" + todoId;
  item.innerHTML = `<label class="list">
<input class="checkbox" type="checkbox" /> 
<span class="text">${todoText}</span>
</label> 
<span class="remove"></span>`;
  if (isNew) {
    todoArray.push({
      active: true,
      DOMelem: item,
      id: todoId++,
      content: todoText,
    });
  } else {
    // check if element has status active or not and add the class todo__elem--checked and update the current todoEl
    todoArray.forEach((arrayObj) => {
      if (arrayObj.id === todoId) {
        //console.log(todoId, arrayObj.id);
        arrayObj.DOMelem = item;
        if (!arrayObj.active) {
          item.classList.add("todo__elem--checked");
        }
      }
    });
  }

  //insert into the DOM
  todoList.appendChild(item);

  // add an event listener to the delete button
  const todo_delete = item.querySelector(".remove");

  todo_delete.addEventListener("click", function () {
    removeElem(item);
  });

  // add an event listener to the check button

  const todo_check = item.querySelector(".checkbox");

  todo_check.addEventListener("click", function () {
    // change the checked status of the element
    changeActiveStatus(item);
    // refresh display of elements accordingly
    //refreshFilters();
  });

  // update the items count
  updateActiveCount();
}

/********************************
 add eventListeners
********************************/
/* Change Theme */
themeIcon.addEventListener("click", () => {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    themeIcon.src = "images/icon-moon.svg";
  } else {
    themeIcon.src = "images/icon-sun.svg";
  }
});

/* clear all completed tasks*/
clearAllEl.addEventListener("click", () => {
  const toRemove = todoArray.filter((obj) => obj.active === false);

  if (
    toRemove.length > 0 &&
    confirm(
      `You are about to remove ${toRemove.length} completed task. Are  you sure?`
    )
  ) {
    toRemove.forEach((elem) => {
      removeElem(elem.DOMelem);
    });
  }
});

/********************************
 working with local storage
********************************/
function getLocalStorage() {
  //update active count in case local is empty

  // if localstorage variable doesn t exists, create it
  if (localStorage.getItem(LOCAL_TODOS) === null) {
    localStorage.setItem(LOCAL_TODOS, JSON.stringify([]));
    console.log(LOCAL_TODOS);
  } else if (JSON.parse(localStorage.getItem(LOCAL_TODOS)).length) {
    //else if storage exists and is not empty,  load the todos from localstorage and  add them to the DOM
    todoArray = JSON.parse(localStorage.getItem(LOCAL_TODOS));
    console.log(todoArray);
    todoArray.forEach((todoElem) => {
      if (todoId < +todoElem.id) todoId = +todoElem.id;
      addTodoElem(todoElem.content, false);
    });
    todoId++;
  }
  // update the active element counts
  updateActiveCount();
}

function updateLocalStorage() {
  // replace the localstorage variable with an up-to-date one
  localStorage.setItem(LOCAL_TODOS, JSON.stringify(todoArray));
}

function removeElem(element) {
  removeElemfromDom(element);
  removeFromStorage(+element.id);
  // need to update current Id to make sure that the next element will be created with the next highest unique id
  updateCurrentId();
  updateActiveCount();
  //in case a filter is active, we update the display of elements accordingly
  //refreshFilters();
}
function removeElemfromDom(elem) {
  // remove element from DOM
  elem.remove();
}
function removeFromStorage(id) {
  //remove element from global array by id
  todoArray = todoArray.filter((todoObj) => {
    return todoObj.id !== +id;
  });

  // update the localstorage with the changes

  updateLocalStorage();
}

/********************************
 working with filters
********************************/
filters.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    console.log(e.target.id);
    filterTodo(e.target.id);
  });
});

function filterTodo(id) {
  todoArray;
  switch (id) {
    case "all":
      todoArray.forEach((item) => {
        if (item.DOMelem.classList.contains("hidden")) {
          item.DOMelem.classList.remove("hidden");
        }
      });
      break;
    case "active":
      todoArray.forEach((item) => {
        if (item.active && item.DOMelem.classList.contains("hidden")) {
          item.DOMelem.classList.remove("hidden");
        } else if (
          item.active === false &&
          !item.DOMelem.classList.contains("hidden")
        ) {
          item.DOMelem.classList.add("hidden");
        }
      });
      break;
    default:
      todoArray.forEach((item) => {
        if (!item.active && item.DOMelem.classList.contains("hidden")) {
          item.DOMelem.classList.remove("hidden");
        } else if (item.active && !item.DOMelem.classList.contains("hidden")) {
          item.DOMelem.classList.add("hidden");
        }
      });
      break;
  }
}
