document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
    displayAcceptedTasks();
    displayDeniedTasks();
});

function displayTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let userTasks = tasks.filter(task => task.assignedTo === currentUser.username);

    userTasks.forEach((task, index) => {
        let listItem = document.createElement("li");

        if (task.status === "Waiting") {
            listItem.innerHTML = `
                ${task.task} - Assigned by ${task.assignedBy}
                <input type="radio" name="action-${index}" onclick='acceptTask("${task.task}")'> Accept
                <input type="radio" name="action-${index}" onclick='denyTask("${task.task}")'> Deny
            `;
        } else if (task.status === "Accepted") {
            listItem.innerHTML = `
                ${task.task} - Status: Accepted 
                <input type="file" id="file-${index}" accept=".pdf,.doc,.jpg,.png">
                <button onclick='uploadFile("${task.task}", ${index})'>Upload</button>
                ${task.file ? `<a href="${task.file}" target="_blank">📂 View File</a>` : ""}
            `;
        }
        taskList.appendChild(listItem);
    });
}

function uploadFile(taskName, index) {
    let fileInput = document.getElementById(`file-${index}`);
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    let file = fileInput.files[0];
    let reader = new FileReader();
    
    reader.onload = function (e) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            if (task.task === taskName && task.assignedTo === JSON.parse(localStorage.getItem("currentUser")).username) {
                task.file = e.target.result;
            }
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("File Uploaded Successfully!");
        displayTasks();
    };

    reader.readAsDataURL(file);
}
