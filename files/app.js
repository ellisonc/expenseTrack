//initialize variables
var socket = io.connect();

var addExpenseButton = document.getElementById("addExpense");
addExpenseButton.onclick = addItem;

var createPaymentButton = document.getElementById("createPayment");
createPaymentButton.onclick = showPayment;

var refreshButton = document.getElementById("refresh");
refreshButton.onclick = refreshTable;

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

var logoutSelectRoomButton = document.getElementById("logoutSelectRoom");
logoutSelectRoomButton.onclick = logout;

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

var backButton = document.getElementById("backButton");
backButton.onclick = loginPage;

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

function loginPage() {
    loginScreen.hidden = false;
    newUserScreen.hidden = true;
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
        document.getElementById("loginErrorMessage").innerHTML = response.error;
    }
    else {
        currentUser = {
            'username': response.username,
            'firstname': response.firstname,
            'room': response.room,
            'userID': response.userID,
            'name': response.name
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

function refreshTable(){
    socket.emit('getRoomData', {
        "roomName": currentUser.room
    });
}

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


    for (var i = 0; i < currentRoom.users.length; i++) {
        userIDs[i] = parseInt(currentRoom.userIDs[i]);
        var temp = String(currentRoom.users[i]);
        var index = parseInt(currentRoom.userIDs[i]);
        usernames[index] = temp;
    }
    
    if (currentRoom.items != null) {
        for (var i = 0; i < currentRoom.items.length; i++) {
            //alert("item found " + i);
            var tempItem = {};
            tempItem.type = String(currentRoom.items[i].type);
            tempItem.recipientID = parseInt(currentRoom.items[i].recipientID);
            tempItem.creatorID = parseInt(currentRoom.items[i].creatorID);
            tempItem.creator = usernames[tempItem.creatorID];
            tempItem.cost = parseInt(currentRoom.items[i].cost);

            var time = parseInt(currentRoom.items[i].date);
            var tempDate = new Date(time);

            tempItem.date = tempDate;

            tempItem.description = String(currentRoom.items[i].description);
            //alert(tempItem.type + " " + tempItem.recipientID + " " + tempItem.creatorID + " " + tempItem.creator + " " + tempItem.cost + " " + tempItem.date + " " + tempItem.description + " ");
            expenses.push(tempItem);
        }
    }

    switchToMainScreen();
});


function createNewUser() {
    var newUserError = document.getElementById("newUserErrorMessage");
    if (newUsernameField.value != "") {
        if (newPasswordField.value != "") {
            if (firstNameField.value != "") {
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
                newUserError.innerHTML = "Enter a screen name";
            }
        }
        else {
            newUserError.innerHTML = "Enter a password";
        }
    }
    else {
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
    selectRoomErrorMessage.innerHTML = "";
    var usernameHeader = document.getElementById("usernameHeader");
    usernameHeader.innerHTML = "You are logged in as: " + currentUser.username;
}

function selectRoom() {
    if (selectRoomName.value != "") {
        roomLogin = {
            roomName: selectRoomName.value,
            password: selectRoomPassword.value,
            name: currentUser.name,
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
        selectRoomName.value = "";
        selectRoomPassword.value = "";
        currentRoom = {
            'roomName': response.roomName,
            'password': response.password,
            'items': response.items,
            'users': response.users
        }
        currentUser.room = currentRoom.roomName;
        socket.emit('getRoomData', {//switched from getRoomData
            "roomName": currentUser.room
        });
        //switchToMainScreen();
    }
    else {
        selectRoomErrorMessage.innerHTML = response.error;
    }
});

function createNewRoom() {
    if (selectRoomName.value != "") {
        if (selectRoomPassword.value != "") {
            var newRoomData = {
                roomName: selectRoomName.value,
                password: selectRoomPassword.value,
                items: null,
                users: [currentUser.name],
                userIDs: [currentUser.userID],
                username: currentUser.username
            }
            currentRoom = {
                'roomName': selectRoomName.value,
                'password': selectRoomPassword.value,
                'items': null,
                'users': [currentUser.name]
            }
            socket.emit("newRoom", newRoomData);
        }
        else {
            selectRoomErrorMessage.innerHTML = "Enter a password";
        }
        
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
        usernames[parseInt(currentUser.userID)] = currentUser.name;
        userIDs[0] = parseInt(currentUser.userID);
        selectRoomName.value = "";
        selectRoomPassword.value = "";
        selectRoomErrorMessage.innerHTML = "";
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
    loginNameField.innerHTML = currentUser.name;
    mainHeaderDiv.innerHTML = "Room: " + currentRoom.roomName;

    var userList = document.getElementById("userList");
    var list = "Users: ";
    for (var i = 0; i < userIDs.length; i++) {
        list += usernames[userIDs[i]];
        if (i != userIDs.length - 1) {
            list += ",";
        }
        list += " ";
    }
    userList.innerHTML = list;
    updateTable();
}

function logout() {
    mainPage.hidden = true;
    hideAddItem();
    loginScreen.hidden = false;
    newUserScreen.hidden = true;
    selectRoomScreen.hidden = true;
}

function hideAddItem() {
    addItemDiv.hidden = true;
    createExpenseButton.hidden = false;
    createPaymentButton.hidden = false;
    var errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "";
}

function showAddExpense() {
    if (currentRoom.userIDs.length == 1) {
        return;
    }
    creatingExpense = true;
    addItemDiv.hidden = false;
    createExpenseButton.hidden = true;
    createPaymentButton.hidden = false;
    addItemTitle.innerHTML = "Creating Expense";
    paymentRecipientDiv.hidden = true;
    addExpenseButton.innerHTML = "Add Expense";
}

function showPayment() {
    if (currentRoom.userIDs.length == 1) {
        return;
    }
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
                var recipientName = paymentRecipient.value;
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
            item.recipientID = null;
            item.type = "expense";
        }
        errorMessage.innerHTML = "";

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
        socket.emit('addItem', { type: item.type, recipientID: item.recipientID, creatorID: item.creatorID, cost: item.cost, date: item.date.getTime(), description: item.description, roomName: currentRoom.roomName });
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
    if (one.date > two.date) {
        return 1;
    }
    if (one.date < two.date) {
        return -1;
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
    header.appendChild(rec);
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
        
        var tempRecip = document.createElement("td");

        if (expenses[i].type == "payment") {
            //var index = usernames.indexOf(expenses[i].recipientID);
            tempRecip.innerHTML = usernames[expenses[i].recipientID];
        }
        else {
            tempRecip.innerHTML = "N/A";
        }
        row.appendChild(tempRecip);

        row.appendChild(c3);
        row.appendChild(c4);

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
    socket.emit('delete', {index: ind, roomName: currentRoom.roomName});

    updateTable();
}

function nameformat(name) {
    return name.charAt(0).toLocaleUpperCase() + name.substr(1, name.length);
}
