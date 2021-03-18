let limit = 5;

let page = {
  pending: 1,
  assigned: 1,
  approved: 1,
  rejected: 1,
};

function resetDiv(div) {
  var childNodes = div.getElementsByClassName("single-task-div");
  while (childNodes[0]) {
    childNodes[0].parentNode.removeChild(childNodes[0]);
  }
}

let getAssignedTasks = async () => {
  let date = document.getElementById("assigned-date-input").value;
  let data = await fetch(
    `/tasks?status=pending&page=${page.pending}&date=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-inner-div")[0];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/submit`);
    a1.appendChild(document.createTextNode("Submit"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

let getReviewedTasks = async () => {
  let date = document.getElementById("reviewed-date-input").value;
  let status = document.getElementById("reviewed-select-input").value;
  let data = await fetch(
    `/tasks?status=${status}&page=${page[status]}&date=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-inner-div")[1];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/view`);
    a1.appendChild(document.createTextNode("View Submission"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

document
  .getElementById("assigned-search-btn")
  .addEventListener("click", getAssignedTasks);

document
  .getElementById("assigned-increment-button")
  .addEventListener("click", () => {
    let status = document.getElementById("assigned-select-input").value;
    page.pending = page.pending + 1;
    getAssignedTasks();
  });

document
  .getElementById("assigned-decrement-button")
  .addEventListener("click", () => {
    let status = document.getElementById("assigned-select-input").value;
    page.pending = page.pending - 1;
    getAssignedTasks();
    getAssignedTasks();
  });


document
  .getElementById("reviewed-search-btn")
  .addEventListener("click", getReviewedTasks);

document
  .getElementById("reviewed-decrement-button")
  .addEventListener("click", () => {
    let status = document.getElementById("reviewed-select-input").value;
    if (status === "approved") {
      page.approved = page.approved + 1;
    } else {
      page.rejected = page.rejected + 1;
    }
    getReviewedTasks();
  });

document
  .getElementById("reviewed-increment-button")
  .addEventListener("click", () => {
    let status = document.getElementById("reviewed-select-input").value;
    if (status === "approved") {
      page.approved = page.approved + 1;
    } else {
      page.rejected = page.rejected + 1;
    }
    getReviewedTasks();
  });

getAssignedTasks();
getReviewedTasks();
