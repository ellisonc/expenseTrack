var addExpenseButton = document.getElementById("addExpense");
addExpenseButton.onclick = addExpense;

var createPaymentButton = document.getElementById("createPayment");
createPaymentButton.onclick = showPayment;

var body = document.getElementById("tableHolder");
var addItemDiv = document.getElementById("addItem");
var createExpenseButton = document.getElementById("createNewExpense");
createExpenseButton.onclick = showAddExpense;
addItemDiv.hidden = true;

var cancelExpenseButton = document.getElementById("cancelItem");
cancelExpenseButton.onclick = hideAddExpense;

var mainPage = document.getElementById("mainPage");
var loginScreen = document.getElementById("loginScreen");
//Setup page here
mainPage.hidden = true;
var loginButton = document.getElementById("login");
loginButton.onclick = login;

var newUserButton = document.getElementById("newUser");
newUserButton.onclick = createNewUser;

var logoutButton = document.getElementById("logout");
logoutButton.onclick = logout;

var date = document.getElementById("date");
var expenses = [];
var userID;
var usernames = [];

var loginNameField = document.getElementById("loginName");
var inputUsernameField = document.getElementById("username");

function getUsernames() {
    usernames = [];
    usernames.push("andrew");
    usernames.push("kevin");
}
function login() {
    getUsernames();

    var inputUsername = inputUsernameField.value;
    inputUsername = inputUsername.toLowerCase();

    if (usernames.indexOf(inputUsername) != -1) {
        userID = usernames.indexOf(inputUsername);
        switchToMainScreen();


    }
    else {
        var loginError = document.getElementById("loginErrorMessage");
        loginError.innerHTML = "Enter a valid username";
    }
}

function createNewUser() {
    var inputUsernameField = document.getElementById("username");
    if (inputUsernameField.value != "") {
        userID = usernames.length;
        usernames.push(inputUsernameField.value);
        switchToMainScreen();

    }
    else {
        var loginError = document.getElementById("loginErrorMessage");
        loginError.innerHTML = "Enter a valid username";
    }
}

function switchToMainScreen() {
    mainPage.hidden = false;
    loginScreen.hidden = true;
    inputUsernameField.innerHTML = "";
    loginNameField.innerHTML = " " + usernames[userID];
    getData();
    updateTable();
}

function logout() {
    mainPage.hidden = true;
    hideAddExpense();
    loginScreen.hidden = false;
}

function getData() {
    //alert("getting data" + expenses.length);
    expense = {};
    expense.creator = "kevin";
    expense.cost = 1000;
    var today = new Date();
    expense.date = today;
    expense.description = "Test Expense";
    expense.creatorID = 1;
    expenses.push(expense);
    //alert("got data" + expenses.length);
}

function hideAddExpense() {
    addItemDiv.hidden = true;
    createExpenseButton.hidden = false;
}

function showAddExpense() {
    addItemDiv.hidden = false;
    createExpenseButton.hidden = true;
}

function showPayment() {

}

function removeChildren(input) {
    while (input.firstChild) {
        input.removeChild(input.firstChild);
    }
}

function addExpense() {
    var description = document.getElementById("description");
    var cost = document.getElementById("cost");
    var date = document.getElementById("date");
    var errorMessage = document.getElementById("errorMessage");
    if (description.value != "" && cost.value != "") {
        errorMessage.innerHTML = "";
        expense = {};
        expense.creator = usernames[userID];

        expense.creatorID = userID;
        expense.cost = cost.value;
        if (date.value != "") {
            var today = new Date(date.value);
            var offset = new Date().getTimezoneOffset();
            today.setMinutes(today.getMinutes() + offset);
        }
        else {
            var today = new Date();
        }
        today.setHours(12);
        expense.date = today
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



function compareExpenseDates(one, two) {
    if (one.date < two.date) {
        return -1;
    }
    if (one.date > two.date) {
        return 1;
    }
    return 0;
}

function updateTable() {
    //alert("updating table" + expenses.length);
    removeChildren(body);
    expenses.sort(compareExpenseDates);
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
    h1.style.width = '80px';
    h2.style.width = '150px';
    h3.style.width = '300px';
    h4.style.width = '100px';
    header.appendChild(h1);
    header.appendChild(h2);
    header.appendChild(h3);
    header.appendChild(h4);

    for (var i = 0; i < usernames.length; i++) {
        var tempHeader = document.createElement("th");
        tempHeader.innerHTML = usernames[i] + " Owes";
        tempHeader.style.width = '150px';
        header.appendChild(tempHeader);
    }

    var h7 = document.createElement("th");
    h7.innerHTML = "Delete";
    h7.style.width = '50px';
    header.appendChild(h7);
    table.appendChild(header);


    var amountPaid = [];
    for (var i = 0; i < usernames.length; i++) {//store user ids as well or lookup to fix array
        amountPaid.push(0);
    }

    for (var i = 0; i < expenses.length; i++) {
        //alert("enter loop" + expenses.length);
        var row = document.createElement("tr");
        var c1 = document.createElement("td");
        var c2 = document.createElement("td");
        var c3 = document.createElement("td");
        var c4 = document.createElement("td");
        c1.innerHTML = (expenses[i].date.getMonth() + 1) + "/" + expenses[i].date.getDate() + "/" + expenses[i].date.getFullYear();
        c2.innerHTML = expenses[i].creator;
        c3.innerHTML = expenses[i].description;
        c4.innerHTML = expenses[i].cost;
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);


        var tempID = parseInt(expenses[i].creatorID);

        amountPaid[tempID] = amountPaid[tempID] + parseInt(expenses[i].cost);
        var totalPaid = 0;


        for (var j = 0; j < amountPaid.length; j++) {
            totalPaid += amountPaid[j];
        }

        for (var j = 0; j < usernames.length; j++) {
            var tempCell = document.createElement("td");
            tempCell.innerHTML = Math.round((totalPaid / usernames.length - amountPaid[j])*100)/100;

            row.appendChild(tempCell);
        }

        //alert(expenses[i].creatorID);

        var c7 = document.createElement("td");
        c7.style.textAlign = "center";
        // alert("here4");
        if (tempID == userID) {
            //alert("here5");
            var deleteButton = document.createElement("button");
            deleteButton.index = i;
            deleteButton.onclick = deleteExpense;
            deleteButton.innerHTML = "X";
            c7.appendChild(deleteButton);
        }
        //alert("here6");
        row.appendChild(c7);

        table.appendChild(row);

    }
    body.appendChild(table);

}

function deleteExpense(e) {
    var target = e.target;
    expenses.splice(e.index, 1);
    updateTable();
}
