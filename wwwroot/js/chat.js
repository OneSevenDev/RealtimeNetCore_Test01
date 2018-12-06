"use strict";

var username = "";
const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();


connection.start()
    .then(function () {
        do {
            username = prompt("Insert your name: ");
            document.getElementById("onlineUsersCount").innerText = username;
            connection.invoke("Connect", username)
                .catch(err => console.error(err.toString()));
        } while (username == null && username == "")
    })
    .catch(err => console.error(err.toString()));

connection.onclose(function() {
    connection.invoke("OnDisconnect", username)
                .catch(err => console.error(err.toString()));
});

connection.on("UpdateUsers", function (userCount, userList) {
    let span = document.createElement("span");
    span.textContent = " - Connected: " + userCount;
    document.getElementById("onlineUsersCount").appendChild(span);
    document.getElementById("userList").innerText = "";
    userList.forEach(element => {
        let li = document.createElement("li");
        li.textContent = element;
        document.getElementById("userList").appendChild(li);
    });
});

connection.on("ReceiveMessage", function (user, message) {
    let msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let encodedMsg = user + ": " + msg;
    let li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    let user = username;
    let message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message)
        .catch(err => console.error(err.toString()));
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});

document.getElementById("messageInput").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("sendButton").click();
    }
});