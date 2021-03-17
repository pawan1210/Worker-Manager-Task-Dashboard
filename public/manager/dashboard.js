let limit = 5;

let page = {
  pending: 1,
  assigned: 1,
  reviewed: 1,
};

function resetDiv(div) {
  var childNodes = div.getElementsByClassName("single-task-div");
  while (childNodes[0]) {
    childNodes[0].parentNode.removeChild(childNodes[0]);
  }
}
let getPendingTasks = async () => {
  let date = document.getElementById("pending-date-input").value;
  let data = await fetch(
    `/tasks?status=pending&page=${page.pending}&date=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-div")[0];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/edit`);
    a1.appendChild(document.createTextNode("Edit"));
    li1.appendChild(a1);
    let li2 = document.createElement("li");
    let a2 = document.createElement("a");
    a2.setAttribute("href", `/task/${task._id}/assign`);
    a2.appendChild(document.createTextNode("Assign"));
    li2.appendChild(a2);
    div.appendChild(h3);
    div.appendChild(li1);
    div.appendChild(li2);
    task_div.appendChild(div);
  });
};

let getAssignedTasks = async () => {
  let date = document.getElementById("assigned-date-input").value;
  let data = await fetch(
    `/tasks?status=assigned&page=${page.assigned}&date=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-div")[1];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/submission`);
    a1.appendChild(document.createTextNode("Review"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

let getReviewedTasks = async () => {
  let date = document.getElementById("reviewed-date-input").value;
  let data = await fetch(
    `/tasks?status=reviewed&page=${page.assigned}&date=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-div")[2];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/submission`);
    a1.appendChild(document.createTextNode("View Solution"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

document
  .getElementById("pending-search-btn")
  .addEventListener("click", getPendingTasks);

document
  .getElementById("assigned-search-btn")
  .addEventListener("click", getAssignedTasks);

document
  .getElementById("pending-decrement-button")
  .addEventListener("click", () => {
    page.pending = Math.max(page.pending - 1, 1);
    getPendingTasks();
  });

document
  .getElementById("pending-increment-button")
  .addEventListener("click", () => {
    page.pending = page.pending + 1;
    getPendingTasks();
  });

getAssignedTasks();
getPendingTasks();
getReviewedTasks();
