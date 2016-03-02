var addExpenseButton = document.getElementById("addExpense");
addExpenseButton.onclick = addExpense;

var body = document.getElementById("tableHolder");
var addItemDiv = document.getElementById("addItem");
var createExpenseButton = document.getElementById("createNewExpense");
createExpenseButton.onclick = showAddExpense;
addItemDiv.hidden = true;

var cancelExpenseButton = document.getElementById("cancelExpense");
cancelExpenseButton.onclick = hideAddExpense;

var mainPage = document.getElementById("mainPage");
var loginScreen = document.getElementById("loginScreen");
//Setup page here
mainPage.hidden = true;
var signInButton = document.getElementById("signIn");
signInButton.onclick = signIn;

function signIn() {
    mainPage.hidden = false;
    loginScreen.hidden = true;
    var expenses = [];
    getData();
}

function getData() {
    alert("getting data");
    expense = {};
    expense.creator = "Kevin Hays";
    expense.cost = 1000;
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    expense.date = month + "/" + day;
    expense.description = "Test Expense";
    expense.creatorID = 2;
    expenses.push(expense);
    updateTable();
}

function hideAddExpense() {
    addItemDiv.hidden = true;
    createExpenseButton.hidden = false;
}

function showAddExpense(){
    addItemDiv.hidden = false;
    createExpenseButton.hidden = true;
}

function removeChildren(input) {
    while (input.firstChild) {
        input.removeChild(input.firstChild);
    }
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
        expense.creatorID = userID.value;
        expense.cost = cost.value;
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        expense.date = month + "/" + day;
        expense.description = description.value;
        expenses.push(expense);
        userID.value = "";
        description.value = "";
        cost.value = "";
        hideAddExpense();
        updateTable();
    }
    else {
        errorMessage.innerHTML = "Input valid values";
    }
}



function updateTable() {
    alert("updating table");
    removeChildren(body);

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
    h4.innerHTML = "Cost";
    var h5 = document.createElement("th");
    h5.innerHTML = "Andrew Ellison Due";
    var h6 = document.createElement("th");
    h6.innerHTML = "Kevin Hays Due";
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

    var due = 0;
    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].creatorID == 1) {
            due += parseInt(expenses[i].cost);
        }
        else {
            due -= parseInt(expenses[i].cost);
        }
        if (due < 0) {
            expenses[i].user1Due = -1*(due / 2);
            expenses[i].user2Due = 0;
        }
        else if (due > 0) {
            expenses[i].user2Due = due / 2;
            expenses[i].user1Due = 0;
        }
        else {
            expenses[i].user1Due = 0;
            expenses[i].user2Due = 0;
        }
    }

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
        c4.innerHTML = expenses[i].cost;
        c5.innerHTML = expenses[i].user1Due;
        c6.innerHTML = expenses[i].user2Due;
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        row.appendChild(c5);
        row.appendChild(c6);
        table.appendChild(row);
    }
    body.appendChild(table);
    
}
