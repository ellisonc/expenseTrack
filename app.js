
//initialize socket io
var socket = io();

//buttons
var addExpenseButton = document.getElementById("addExpense");
addExpenseButton.onclick = addItem;

var createPaymentButton = document.getElementById("createPayment");
createPaymentButton.onclick = showPayment;

var body = document.getElementById("tableHolder");
var addItemDiv = document.getElementById("addItem");
var createExpenseButton = document.getElementById("createNewExpense");
createExpenseButton.onclick = showAddExpense;
addItemDiv.hidden = true;

var addItemTitle = document.getElementById("addItemTitle");
var paymentRecipientDiv = document.getElementById("paymentRecipientDiv");
var paymentRecipient = document.getElementById("paymentRecipient");


var cancelExpenseButton = document.getElementById("cancelItem");
cancelExpenseButton.onclick = hideAddItem;

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

var creatingExpense = true;

var date = document.getElementById("date");
var expenses = [];
var userID;
var usernames = [];

var loginNameField = document.getElementById("loginName");
var inputUsernameField = document.getElementById("username");
//skipLogin();
function skipLogin() {
    getUsernames();
    userID = 1;
    switchToMainScreen();
}

function getUsernames() {
    usernames = [];
    usernames.push("andrew");
    usernames.push("kevin");
    usernames.push("third");
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
    hideAddItem();
    loginScreen.hidden = false;
}

function getData() {
    //alert("getting data" + expenses.length);
    expense = {};
    expense.creator = "kevin";
    expense.type = "expense";
    expense.cost = 1000;
    var today = new Date();
    expense.date = today;
    expense.description = "Test Expense";
    expense.creatorID = 1;
    expenses.push(expense);
    //alert("got data" + expenses.length);
}

function hideAddItem() {
    addItemDiv.hidden = true;
    createExpenseButton.hidden = false;
    createPaymentButton.hidden = false;

}

function showAddExpense() {
    creatingExpense = true;
    addItemDiv.hidden = false;
    createExpenseButton.hidden = true;
    createPaymentButton.hidden = false;
    addItemTitle.innerHTML = "Creating Expense";
    paymentRecipientDiv.hidden = true;
    addExpenseButton.innerHTML = "Add Expense";
}

function showPayment() {
    creatingExpense = false;
    addItemDiv.hidden = false;
    createPaymentButton.hidden = true;
    createExpenseButton.hidden = false;
    addItemTitle.innerHTML = "Creating Payment";
    addExpenseButton.innerHTML = "Log Payment";
    if (usernames.length > 2) {
        paymentRecipientDiv.hidden = false;
    }
}

function removeChildren(input) {
    while (input.firstChild) {
        input.removeChild(input.firstChild);
    }
}

//Add a payment or an expense
function addItem() {
    var description = document.getElementById("description");
    var cost = document.getElementById("cost");
    var date = document.getElementById("date");
    var errorMessage = document.getElementById("errorMessage");
    var paymentRecipient = document.getElementById("paymentRecipient");

    if (description.value != "" && cost.value != "") {
        item = {};
        if (!creatingExpense) {
            item.type = "payment";
            if (usernames.length > 2) {
                if (paymentRecipient.value == "") {
                    errorMessage.innerHTML = "Input valid values";
                    return;
                }
                var recipientName = paymentRecipient.value.toLowerCase();
                var index = usernames.indexOf(recipientName);
                if (index == -1 || index == userID) {
                    errorMessage.innerHTML = "Input valid recipient";
                    return;
                }
                item.recipientID = index;
            }
            else {
                if (userID == 1) {
                    item.recipientID = 0;
                }
                else {
                    item.recipientID = 1;
                }
            }
        }
        else {
            item.type = "expense";
        }
        
        
        item.creator = usernames[userID];
        item.cost = cost.value;
        if (date.value != "") {
            var today = new Date(date.value);
            var offset = new Date().getTimezoneOffset();
            today.setMinutes(today.getMinutes() + offset);
        }
        else {
            var today = new Date();
        }
        item.creatorID = userID;
        item.date = today;
        item.description = description.value;

        //communicate with server to add the item
        //socket.emit('addItem', {type: item.type, creatorID: item.creatorID, cost: item.cost, date: item.date, description: item.description});
        console.log('emitted');

        expenses.push(item);
        userID.value = "";
        description.value = "";
        cost.value = "";
        date.value = "";
        hideAddItem();
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
    var type = document.createElement("th");
    type.innerHTML = "Type";
    type.style.width = '75px';
    var h3 = document.createElement("th");
    h3.innerHTML = "Description";
    var h4 = document.createElement("th");
    h4.innerHTML = "Amount";
    var rec = document.createElement("th");
    rec.innerHTML = "Recipient";
    rec.style.width = '120px';
    h1.style.width = '80px';
    h2.style.width = '120px';
    h3.style.width = '300px';
    h4.style.width = '100px';
    header.appendChild(h1);
    header.appendChild(h2);
    header.appendChild(type);
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
        var tempType = document.createElement("td");
        if (expenses[i].type == "payment") {
            tempType.innerHTML = "(PAYMT) ";
        }
        else {
            tempType.innerHTML = "(EXPNS) ";
        }
        
        c3.innerHTML = expenses[i].description;
        c4.innerHTML = expenses[i].cost;
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(tempType);
        row.appendChild(c3);
        row.appendChild(c4);
        var tempRecip = document.createElement("td");
        
        if (expenses[i].type == "payment") {
            var index = usernames.indexOf(expenses[i].recipientID);
            tempRecip.innerHTML = usernames[index];
        }
        else {
            tempRecip.innerHTML = "N/A";
        }


        var tempID = parseInt(expenses[i].creatorID);
       // alert(expenses[i].cost);
        if (expenses[i].type == "payment") {
            amountPaid[expenses[i].recipientID] -= parseFloat(expenses[i].cost);
        }
        amountPaid[tempID] += parseFloat(expenses[i].cost);
      
        //alert(amountPaid.toString());
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
