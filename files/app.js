// JavaScript source code

var body = document.getElementById("body");

var table = document.createElement("table");
table.style.columnWidth = 100;
table.border = 2;

var header = document.createElement("tr");
var h1 = document.createElement("th");
h1.innerHTML = "Date";
var h2 = document.createElement("th");
h2.innerHTML = "Creator";
var h3 = document.createElement("th");
h3.innerHTML = "Price";
var h4 = document.createElement("th");
h4.innerHTML = "Balance 1";
var h5 = document.createElement("th");
h5.innerHTML = "Balance 2";
header.appendChild(h1);
header.appendChild(h2);
header.appendChild(h3);
header.appendChild(h4);
header.appendChild(h5);
table.appendChild(header);


//var expenses = [];
for (var i = 0; i < 10; i++) {
    var expense = {};
    expense.creator = "c";
    expense.price = 10;
    expense.day = 10;
    expense.month = 10;
    expense.year = 2016;
    //expenses.push(expense);
}

for (var i = 0; i < 10; i ++){
    var row = document.createElement("tr");
    var c1 = document.createElement("td");
    var c2 = document.createElement("td");
    var c3 = document.createElement("td");
    var c4 = document.createElement("td");
    var c5 = document.createElement("td");
    /*c1.innerHTML = expenses[i].day;
    c2.innerHTML = expenses[i].creator;
    c3.innerHTML = expenses[i].price;
    c4.innerHTML = expenses[i].creator;
    c5.innerHTML = expenses[i].creator;*/
    row.appendChild(c1);
    row.appendChild(c2);
    row.appendChild(c3);
    row.appendChild(c4);
    row.appendChild(c5);
    table.appendChild(row);
}
body.appendChild(table);