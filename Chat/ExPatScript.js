//Load Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getDatabase,
    query,
    limitToLast,
    limitToFirst,
    remove,
    onChildAdded,
    onDisconnect,
    ref,
    get,
    set,
    onValue,
    increment,
    push
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
//ExPat Initialize.
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-functions.js";

//Initilize
const App = initializeApp({
    apiKey: "AIzaSyBunyChVwR7Wq0CeQ1J2vaCUW1onWBXpEU",
    authDomain: "ex-patriot.firebaseapp.com",
    projectId: "ex-patriot",
    messagingSenderId: "407951799946",
    appId: "1:407951799946:web:2b7b91807ef6ed3841df73",
    databaseURL: "https://ex-patriot-default-rtdb.firebaseio.com/"
}, "exPat");

const fbMessaging = getMessaging(App);
const fbFunctions = getFunctions(App);
const db = getDatabase(App)

window.logIn = async function (user, key) {
    //Clear input fields
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
    //Attempt Server-side login.
    var result = await httpsCallable(fbFunctions, "attemptLogIn")({
        user: user,
        key: key
    });
    //Check success.
    if (result.data != "Log In Failed!") {
        //Set session info.
        console.log(document.cookie)
        console.log(client)
        client.ExPat.User = user;
        client.ExPat.Session = result.data;
        updateCookie();

        //Swap Login for Declaration.
        document.getElementById("LogIn").setAttribute("Hidden", "True");
        document.getElementById("ExPatDeclaration").removeAttribute("Hidden", "True");

        //Get Club Memberships
        var clubs = await inquire("Memberships");
        populateExplorer(clubDirect, clubs, "clubs", "loadRooms(this.innerText)")


    } else document.getElementById("LogIn").innerHTML = "Log in failed.";
}

//Fill lists with contents, usually from the server.
window.populateExplorer = function (container, content, contentClass, clickFunc) {
    Object.entries(content).forEach(x => {
        x = x[0];
        container.insertAdjacentHTML("beforeend", "<div class='" + contentClass + "' onclick=\"" + clickFunc + "\">" + x + "</div>")
    })
}

window.logout = async function () {
    //Set session info.
    client.ExPat.User = "Signed-Out";
    client.ExPat.Session = "None";
    updateCookie();

    //Swap Login for Declaration.
    document.getElementById("LogIn").removeAttribute("Hidden", "false");
    document.getElementById("ExPatDeclaration").setAttribute("Hidden", "True");

    clubDirect.innerHTML = "";
    roomDirect.innerHTML = "";
}

window.inquire = async function (inquiry, context) {
    var result = await httpsCallable(fbFunctions, "authorize")({
        user: client.ExPat.User,
        inquiry: inquiry,
        key: client.ExPat.Session,
        context: context
    });

    console.log("Inquiry Result:")
    console.log(result.data)
    return result.data
}

window.loadRooms = async function (clubName) {
    roomDirect.innerHTML = "";

    activeClub = await inquire("ClubRooms", clubName);

    populateExplorer(roomDirect, activeClub, "rooms", "setRoom(this.innerText)");
}

window.setRoom = async function (room) {
    //inquire about room details.
    var room = activeClub[room];
    //Check Participance.
    if (room.Participants[client.ExPat.User] == "") {
        var chatHTML = await fetch("../Chat.html");
        chatHTML = await chatHTML.text();
        roomApp.innerHTML=chatHTML
    } else roomApp.innerText = "Sorry, This room is private."
    //load room
    //load room settings
    //inquire club permissions?
}