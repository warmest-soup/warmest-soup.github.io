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

    var result = await httpsCallable(fbFunctions, "attemptLogIn")({
        user: user,
        key: key
    });

    console.log(result.data)
}