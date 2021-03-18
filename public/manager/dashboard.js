let limit = 5;

let page = {
  pending: 1,
  submitted: 1,
  unassigned: 1,
  approved: 1,
  rejected: 1,
};

function resetDiv(div) {
  var childNodes = div.getElementsByClassName("single-task-div");
  while (childNodes[0]) {
    childNodes[0].parentNode.removeChild(childNodes[0]);
  }
}
let getUnassignedTasks = async () => {
  const manager_id = JSON.parse(localStorage.getItem("data")).manager_id;
  const tasks_url = `/task/${manager_id}/all`;
  let date = document.getElementById("unassigned-date-input").value;
  let data = await fetch(
    `${tasks_url}?status=unassigned&page=${page.unassigned}&created_on=${date}`
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
    a1.setAttribute("href", `/task/${task._id}`);
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
  
  const manager_id = JSON.parse(localStorage.getItem("data")).manager_id;
  const tasks_url = `/task/${manager_id}/all`;
  let date = document.getElementById("assigned-date-input").value;
  let status = document.getElementById("assigned-select-input").value;
  let url=null;
  if(status==="pending"){
    url = `${tasks_url}?status=${status}&page=${page[status]}&created_on=${date}`;
  }else{
     url = `${tasks_url}?status=${status}&page=${page[status]}&submitted_on=${date}`;
  }
  let data = await fetch(
    url
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
    a1.setAttribute("href", `/task/${task._id}/review`);
    a1.appendChild(document.createTextNode("Review"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

let getReviewedTasks = async () => {
  const manager_id = JSON.parse(localStorage.getItem("data")).manager_id;
  const tasks_url = `/task/${manager_id}/all`;
  let date = document.getElementById("reviewed-date-input").value;
  let status = document.getElementById("reviewed-select-input").value;
  let data = await fetch(
    `${tasks_url}?status=${status}&page=${page[status]}&submitted_on=${date}`
  ).then((response) => response.json());
  let task_div = document.getElementsByClassName("task-inner-div")[2];
  resetDiv(task_div);
  data.tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "single-task-div";
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(task.name));
    let li1 = document.createElement("li");
    let a1 = document.createElement("a");
    a1.setAttribute("href", `/task/${task._id}/review`);
    a1.appendChild(document.createTextNode("View Solution"));
    li1.appendChild(a1);
    div.appendChild(h3);
    div.appendChild(li1);
    task_div.appendChild(div);
  });
};

document
  .getElementById("unassigned-search-btn")
  .addEventListener("click", getUnassignedTasks);

document
  .getElementById("unassigned-increment-button")
  .addEventListener("click", () => {
    page.unassigned = page.pending + 1;
    getUnassignedTasks();
  });

document
  .getElementById("unassigned-decrement-button")
  .addEventListener("click", () => {
    page.unassigned = Math.max(page.assigned - 1, 1);
    getUnassignedTasks();
  });

document
  .getElementById("assigned-search-btn")
  .addEventListener("click", getAssignedTasks);

document
  .getElementById("assigned-increment-button")
  .addEventListener("click", () => {
    let status = document.getElementById("assigned-select-input").value;
    if (status === "pending") {
      page.pending = page.pending + 1;
    } else {
      page.submitted = page.submitted + 1;
    }
    getAssignedTasks();
  });

document
  .getElementById("assigned-decrement-button")
  .addEventListener("click", () => {
    let status = document.getElementById("assigned-select-input").value;
    if (status === "pending") {
      page.pending = Math.max(page.pending - 1, 1);
    } else {
      page.submitted = Math.max(page.submitted - 1, 1);
    }
    getAssignedTasks();
  });


 document
   .getElementById("reviewed-search-btn")
   .addEventListener("click", getReviewedTasks); 

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

document
  .getElementById("reviewed-decrement-button")
  .addEventListener("click", () => {
    let status = document.getElementById("reviewed-select-input").value;
    if (status === "approved") {
      page.approved = Math.max(page.approved - 1, 1);
    } else {
      page.rejected = Math.max(page.rejected - 1, 1);
    }
    getReviewedTasks();
  });

getUnassignedTasks();
getAssignedTasks();
getReviewedTasks();
