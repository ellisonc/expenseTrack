//initialize variables
var socket = io.connect();

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
var newUserScreen = document.getElementById("newUserScreen");


var selectRoomScreen = document.getElementById("selectRoomScreen");
var selectRoomName = document.getElementById("roomName");
var selectRoomPassword = document.getElementById("roomPassword");
var selectRoomButton = document.getElementById("selectRoom");
var createNewRoomButton = document.getElementById("createNewRoom");
var selectRoomErrorMessage = document.getElementById("newRoomErrorMessage");

selectRoomButton.onclick = selectRoom;
createNewRoomButton.onclick = createNewRoom;

var mainHeaderDiv = document.getElementById("mainHeader");

//Setup page here
selectRoomScreen.hidden = true;


mainPage.hidden = true;
newUserScreen.hidden = true;
var loginButton = document.getElementById("login");
loginButton.onclick = login;

var newUserButton = document.getElementById("newUser");
newUserButton.onclick = newuser;

var createNewUserButton = document.getElementById("createNewUser");
createNewUserButton.onclick = createNewUser;

var logoutButton = document.getElementById("logout");
logoutButton.onclick = logout;


var creatingExpense = true;


//globals
var currentUser;
var currentRoom;
var date = document.getElementById("date");
var expenses = [];
var userID;
var userIDs = [];
var usernames = [];




//login and new user input fields
var loginNameField = document.getElementById("loginName");
var inputUsernameField = document.getElementById("username");
var newUsernameField = document.getElementById("newUsername");
var newPasswordField = document.getElementById("newPassword");
var passwordField = document.getElementById("password");
var firstNameField = document.getElementById("firstName");

inputUsernameField.focus();
//press enter to submit
passwordField.onkeypress = function (e) {
    if (!e) e = window.event;
    var key = e.keyCode || e.which;
    if (key == '13') {
        login();
        return;
    }
};
newPasswordField.onkeypress = function (e) {
    if (!e) e = window.event;
    var key = e.keyCode || e.which;
    if (key == '13') {
        login();
        return;
    }
};
var newUserError = document.getElementById("newUserErrorMessage");
//check username availablity


function newuser() {
    loginScreen.hidden = true;
    newUserScreen.hidden = false;
    newUsernameField.focus();
}

function getUsernames() {
    usernames = [];
    usernames.push("andrew");
    usernames.push("kevin");
    usernames.push("third");
}

function login() {
    var tempUsername = inputUsernameField.value;
    var tempPass = passwordField.value;

    socket.emit('loginAttempt', {
        "username": tempUsername,
        "password": tempPass//don't forget to hash this at some point. aint no on got time for that
    });
}

socket.on('loginResponse', function (response) {
    console.log(response);
    if (response.result == false) {
        document.getElementById("loginErrorMessage").innerHTML = "Login Failed, Try again";
    }
    else {
        currentUser = {
            'username': response.username,
            'firstname': response.firstname,
            'room': response.room,
            'userID': response.userID
        };
        userID = currentUser.userID;
        document.getElementById("loginErrorMessage").innerHTML = "";
        inputUsernameField.value = "";
        passwordField.value = "";
        if (currentUser.room == null) {
            switchToRoomSelectScreen();
        }
        else {
            socket.emit('getRoomData', {
                "roomName": currentUser.room
            });
        } 
    }
});

socket.on('returnRoomData', function (response) {
    expenses = [];
    usernames = [];
    userIDs = [];
    currentRoom = {
        'roomName': response.roomName,
        'items': response.items,
        'users': response.users,
        'userIDs': response.userIDs
    };

    if (currentRoom.items != null) {
        for (var i = 0; i < currentRoom.items.length; i++) {
            alert(currentRoom.items[i]);
        }
    }

    for (var i = 0; i < currentRoom.users.length; i++) {
        userIDs[i] = parseInt(currentRoom.userIDs[i]);
        var temp = String(currentRoom.users[i]);
        var index = parseInt(currentRoom.userIDs[i]);
        usernames[index] = temp;
    }
    //alert(userIDs);
   // alert(usernames);

    switchToMainScreen();
});


function createNewUser() {

    if (newUsernameField.value != "") {
        //send things to server
        var tempPass = newPasswordField.value;
        var newUserData = {
            username: newUsernameField.value,
            password: tempPass,
            name: firstNameField.value,
        };
        currentUser = {
            'username': newUserData.username,
            'name': newUserData.name,
            'room': null,
            'userID': -1
        };
        socket.emit("newUser", newUserData);

        newUsernameField.value = "";
        newPasswordField.value = "";
        firstNameField.value = "";
    }
    else {
        var newUserError = document.getElementById("newUserErrorMessage");
        newUserError.innerHTML = "Enter a valid username";
    }
}

socket.on("createUserResponse", function (response) {
    if (response.success) {
        currentUser.userID = response.userID;
        userID = currentUser.userID;
        switchToRoomSelectScreen();
    }
    else {
        var newUserError = document.getElementById("newUserErrorMessage");
        newUserError.innerHTML = "Username already taken";
    }
});

function switchToRoomSelectScreen(){
    loginScreen.hidden = true;
    newUserScreen.hidden = true;
    selectRoomScreen.hidden = false;
    inputUsernameField.innerHTML = "";
    var usernameHeader = document.getElementById("usernameHeader");
    usernameHeader.innerHTML = "You are logged in as: " + currentUser.username;
}

function selectRoom() {
    if (selectRoomName.value != "") {
        roomLogin = {
            roomName: selectRoomName.value,
            password: selectRoomPassword.value,
            username: currentUser.username,
            userID: currentUser.userID
        }
        socket.emit("roomLogin", roomLogin);
    }
    else {
        selectRoomErrorMessage.innerHTML = "Enter a valid room";
    }
}

socket.on("roomLoginResponse", function (response) {
    if (response.result) {
        currentRoom = {
            "roomName": response.roomName,
            "items": response.items,
            "users": response.users
        }
        currentUser.room = currentRoom.roomName;
        switchToMainScreen();
    }
    else {
        selectRoomErrorMessage.innerHTML = response.error;
    }
});

function createNewRoom() {
    if (selectRoomName.value != "") {
        var newRoomData = {
            roomName: selectRoomName.value,
            password: selectRoomPassword.value,
            items: null,
            users: [currentUser.username],
            userIDs: [currentUser.userID],
            username: currentUser.username
        }
        currentRoom = {
            'roomName':selectRoomName.value,
            'password': selectRoomPassword.value,
            'items':null,
            'users': [currentUser.username]
        }
        socket.emit("newRoom", newRoomData);
        
    }
    else {
        selectRoomErrorMessage.innerHTML = "Enter a valid room";
    }
}

socket.on("createRoomResponse", function (response) {
    if (response) {
        expenses = [];
        usernames = [];
        userIDs = [];
        usernames[parseInt(currentUser.userID)] = currentUser.username;
        userIDs[0] = parseInt(currentUser.userID);
        alert(userIDs);
        alert(usernames);
        switchToMainScreen();
    }
    else {
        selectRoomErrorMessage.innerHTML = "Room name already taken";
    }
});


function switchToMainScreen() {
    selectRoomScreen.hidden = true;
    mainPage.hidden = false;
    loginScreen.hidden = true;
    newUserScreen.hidden = true;
    inputUsernameField.innerHTML = "";
    loginNameField.innerHTML = currentUser.username;
    mainHeaderDiv.innerHTML = "Room: " + currentRoom.roomName;
    updateTable();
}

function logout() {
    mainPage.hidden = true;
    hideAddItem();
    loginScreen.hidden = false;
}
/*
function getData() {
    expense = {};
    expense.creator = "kevin";
    expense.type = "expense";
    expense.cost = 1000;
    var today = new Date();
    expense.date = today;
    expense.description = "Test Expense";
    expense.creatorID = 1;
    expenses.push(expense);
}*/

function hideAddItem() {
    addItemDiv.hidden = true;
    createExpenseButton.hidden = false;
    createPaymentButton.hidden = false;
    var errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "";
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

function addItem() {
    var description = document.getElementById("description");
    var cost = document.getElementById("cost");
    var date = document.getElementById("date");
    var errorMessage = document.getElementById("errorMessage");
    var paymentRecipient = document.getElementById("paymentRecipient");
    //alert(description.value);
    //alert(cost.value);
    if (description.value != "" && cost.value != "") {

        //alert("if");
        item = {};
        if (!creatingExpense) {
            item.type = "payment";
            if (userIDs.length > 2) {
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
                var index = userIDs.indexOf(userID);
                if (index == 1) {
                    item.recipientID = userIDs[0];
                }
                else {
                    item.recipientID = userIDs[1];
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
        socket.emit('addItem', { type: item.type, creatorID: item.creatorID, cost: item.cost, date: item.date, description: item.description, roomName: currentRoom.roomName });
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
    userID = parseInt(currentUser.userID);
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


    for (var i = 0; i < userIDs.length; i++) {
        var tempHeader = document.createElement("th");
        tempHeader.innerHTML = nameformat(usernames[userIDs[i]]) + " Owes";
        tempHeader.style.width = '150px';
        header.appendChild(tempHeader);
    }



    var h7 = document.createElement("th");
    h7.innerHTML = "Delete";
    h7.style.width = '50px';
    header.appendChild(h7);
    table.appendChild(header);


    
    var amountPaid = [];
    for (var i = 0; i < userIDs.length; i++) {//store user ids as well or lookup to fix array
        var index = parseInt(userIDs[i]);
        amountPaid[index] = 0;
    }
    //alert(userIDs);
    //alert(amountPaid);

    
    for (var i = 0; i < expenses.length; i++) {
        var row = document.createElement("tr");

        if (i == 0 || i % 2 == 0) {
            if (expenses[i].creatorID == userID) {
                row.id = "myEven";
            }
            else {
                row.id = "even";
            }
        }
        else {
            if (expenses[i].creatorID == userID) {
                row.id = "myOdd";
            }
            else {
                row.id = "odd";
            }
        }

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
            //var index = usernames.indexOf(expenses[i].recipientID);
            tempRecip.innerHTML = usernames[expenses[i].recipientID];
        }
        else {
            tempRecip.innerHTML = "N/A";
        }

       

        //alert(expenses[i].creatorID);
        var tempID = parseInt(expenses[i].creatorID);
        if (expenses[i].type == "payment") {
            amountPaid[parseInt(expenses[i].recipientID)] -= parseFloat(expenses[i].cost);
        }
        amountPaid[tempID] += parseFloat(expenses[i].cost);

        var totalPaid = 0;

        for (var j = 0; j < userIDs.length; j++) {
            totalPaid += amountPaid[userIDs[j]];
        }
        //alert(amountPaid);
        for (var j = 0; j < userIDs.length; j++) {
            var tempCell = document.createElement("td");
            tempCell.innerHTML = Math.round((totalPaid / userIDs.length - amountPaid[userIDs[j]]) * 100) / 100;

            row.appendChild(tempCell);
        }

        var c7 = document.createElement("td");
        c7.style.textAlign = "center";
        if (tempID == userID) {
            var deleteButton = document.createElement("button");
            deleteButton.index = i;
            deleteButton.onclick = deleteExpense;
            deleteButton.innerHTML = "X";
            deleteButton.className = "delete";
            c7.appendChild(deleteButton);
        }
        row.appendChild(c7);

        table.appendChild(row);

    }
    body.appendChild(table);
    table.hidden = false;
}

function deleteExpense() {
    var ind = this.index;
    expenses.splice(this.index, 1);

    //communicate deletion with server
    socket.emit('delete', ind);
    console.log('delete');

    updateTable();
}

function nameformat(name) {
    return name.charAt(0).toLocaleUpperCase() + name.substr(1, name.length);
}
