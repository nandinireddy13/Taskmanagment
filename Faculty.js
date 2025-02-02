document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
    displayAcceptedTasks();
    displayDeniedTasks();
});

function displayTasks() {
    let taskList = document.getElementById("taskList");
    let acceptedTaskList = document.getElementById("acceptedTaskList");
    
    taskList.innerHTML = "";
    acceptedTaskList.innerHTML = "";

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let userTasks = tasks.filter(task => task.assignedTo === currentUser.username);

    userTasks.forEach((task, index) => {
        let listItem = document.createElement("li");

        if (task.status === "Waiting") {
            listItem.innerHTML = `${task.task} - Assigned by ${task.assignedBy} 
                <input type="radio" name="action-${index}" onclick='acceptTask("${task.task}", "${task.assignedTo}")'> Accept
                <input type="radio" name="action-${index}" onclick='denyTask("${task.task}")'> Deny`;
            taskList.appendChild(listItem);
        } else if (task.status === "Accepted") {
            listItem.innerHTML = `${task.task} - Status: Accepted`;
            acceptedTaskList.appendChild(listItem);
        }
    });
}


function acceptTask(taskName, assignedTo) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        if (task.task === taskName && task.assignedTo === assignedTo) {
            task.status = "Accepted";
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Task Accepted!");
    displayTasks();
    displayAcceptedTasks();
}

function denyTask(taskName) {
    let reason = prompt("Enter reason for denial:");
    if (reason) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
            if (task.task === taskName) {
                task.status = "Denied";
                task.reason = reason;
            }
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("Task Denied!");
        displayTasks();
        displayDeniedTasks();
    }
}
function displayAcceptedTasks() {
    let acceptedTaskList = document.getElementById("acceptedTaskList");
    if (!acceptedTaskList) return;

    acceptedTaskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let acceptedTasks = tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Accepted");

    if (acceptedTasks.length === 0) {
        acceptedTaskList.innerHTML = "<li>No tasks accepted yet.</li>";
        return;
    }

    acceptedTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${task.task} - Status: Accepted`;
        acceptedTaskList.appendChild(listItem);
    });

    console.log("Accepted tasks displayed successfully!");
}

function displayDeniedTasks() {
    let deniedTaskList = document.getElementById("deniedTaskList");
    if (!deniedTaskList) return;

    deniedTaskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let deniedTasks = tasks.filter(task => task.assignedTo === currentUser.username && task.status === "Denied");

    if (deniedTasks.length === 0) {
        deniedTaskList.innerHTML = "<li>No denied tasks.</li>";
        return;
    }

    deniedTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${task.task} - Denied (Reason: ${task.reason})`;
        deniedTaskList.appendChild(listItem);
    });

    console.log("Denied tasks displayed successfully!");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
    setTimeout(() => {
        window.location.replace("index.html");
    }, 100);
}
