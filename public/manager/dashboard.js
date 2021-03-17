let page={
    unassigned:1,
    assigned:1,
    reviewed:1
}

let getTasks=(page,status,date)=>{
    fetch(`/tasks?status=${status}&page=${page}&date=${date}`).then((response)=>response.json()).then((data)=>console.log(data));
}

let unassigned_date = document.getElementById("unassigned-date-input").value;
let assigned_date = document.getElementById("assigned-date-input").value;
let reviewed_date = document.getElementById("reviewed-date-input").value;
console.log(unassigned_date);