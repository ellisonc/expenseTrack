var addExpenseButton = document.getElementById("addExpense");
addExpenseButton.onclick = addExpense;
var body = document.getElementById("body");

var expenses = [];
getData();
function getData() {
    alert("start get date");
    expense = {};
    expense.creator = "Kevin Hays";
    expense.cost = 1000;
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    expense.date = day + "/" + month;
    expense.description = "Test Expense";
    expenses.push(expense);
    alert("end get date");
    updateTable();
}

function removeChildren(input) {
    alert("remove children start");
    while (input.firstChild) {
        input.removeChild(input.firstChild);
    }
    alert("remove children end");
}

function addExpense() {
    var userID = document.getElementById("userID")
    var description = document.getElementById("description");
    var cost = document.getElementById("cost");
    var errorMessage = document.getElementById("errorMessage");
    if (userID.value != "" && description.value != "" && cost.value != "" && userID.value > 0 && userID.value < 3) {
        errorMessage.innerHTML = "";
        expense = {};
        if (userID.value == 1) {
            expense.creator = "Andrew Ellison";
        }
        else {
            expense.creator = "Kevin Hays";
        }
        expense.cost = cost.value;
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        expense.date = day + "/" + month;
        expense.description = "fixme";
        expenses.push(expense);
        updateTable();
    }
    else {
        errorMessage.innerHTML = "values" + userID.value + " " + description.value + " " + cost.value;
    }
}



function updateTable() {
    alert("update table start");
    removeChildren(body);
    alert("update table start2");
    var table = document.createElement("table");
    table.border = 1;

    var header = document.createElement("tr");
    var h1 = document.createElement("th");
    h1.innerHTML = "Date";
    var h2 = document.createElement("th");
    h2.innerHTML = "Creator";
    var h3 = document.createElement("th");
    h3.innerHTML = "Description";
    var h4 = document.createElement("th");
    h4.innerHTML = "Price";
    var h5 = document.createElement("th");
    h5.innerHTML = "Balance 1";
    var h6 = document.createElement("th");
    h6.innerHTML = "Balance 2";
    h1.style.width = '200px';
    h2.style.width = '200px';
    h3.style.width = '200px';
    h4.style.width = '200px';
    h5.style.width = '200px';
    h6.style.width = '200px';
    header.appendChild(h1);
    header.appendChild(h2);
    header.appendChild(h3);
    header.appendChild(h4);
    header.appendChild(h5);
    header.appendChild(h6);
    table.appendChild(header);

    alert("update table loop");


    for (var i = 0; i < expenses.length; i++) {
        var row = document.createElement("tr");
        var c1 = document.createElement("td");
        var c2 = document.createElement("td");
        var c3 = document.createElement("td");
        var c4 = document.createElement("td");
        var c5 = document.createElement("td");
        var c6 = document.createElement("td");
        c1.innerHTML = expenses[i].date;
        c2.innerHTML = expenses[i].creator;
        c3.innerHTML = expenses[i].description;
        c4.innerHTML = expenses[i].price;
        c5.innerHTML = expenses[i].creator;
        c6.innerHTML = expenses[i].creator;
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        row.appendChild(c5);
        row.appendChild(c6);
        table.appendChild(row);
    }
    body.appendChild(table);
    alert("update table end");
}
