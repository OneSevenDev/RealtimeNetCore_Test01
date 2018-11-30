"use strict";

var username = "";
do {
    username = prompt("Insert your name: ");
} while (username == null && username == "")

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// connection.on("UpdateUsers", function (user) {
//     var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     var encodedMsg = user + ": " + msg;
//     var li = document.createElement("li");
//     li.textContent = encodedMsg;
//     document.getElementById("messagesList").appendChild(li);
// });

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + ": " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = username;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});