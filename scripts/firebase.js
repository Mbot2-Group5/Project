//import Firebase-Funktionen
import {initializeApp} from "../librarys/firebase/firebase-app.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../librarys/firebase/firebase-auth.js";

//import Firebase/Google-Analytics
import {getAnalytics, initializeAnalytics} from "../librarys/firebase/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuEMb5P46AJKw_poFaXjmJRz62FlFM1hM",
    authDomain: "sypgroup5.firebaseapp.com",
    projectId: "sypgroup5",
    storageBucket: "sypgroup5.appspot.com",
    messagingSenderId: "65548177393",
    appId: "1:65548177393:web:31488286c5af20d1be7e50",
    measurementId: "G-7DDBJX9VBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Analytics
const analytics = initializeAnalytics(app);

// User einloggen & in Analytics aufnehmen
export function logInWithFirebase(event) {
    event.preventDefault();
    let email = document.getElementById("email_log").value;
    let password = document.getElementById("passw_log").value;

    if (email !== "" && password !== "") {
        signInWithEmailAndPassword(email, password)
            .then(() => {
                // Log successful login event
                analytics.logEvent('login', {method: 'email'});
            })
            .catch(function (error) {
                let errorCode = error.code;
                let errorMessage = error.message;

                document.getElementById("error1").textContent = "Message: " + errorMessage + " Code: " + errorCode;
            });
    } else {
        document.getElementById("error1").textContent = "Bitte alle Felder ausfüllen";
    }
}

// User registrieren & in Analytics aufnehmen
export function registerWithFirebase(event) {
    event.preventDefault();
    let email = document.getElementById("email_reg").value;
    let password = document.getElementById("passw_reg").value;

    if (email !== "" && password !== "") {
        createUserWithEmailAndPassword(email, password)
            .then(() => {
                // Log successful registration event
                analytics.logEvent('register', {method: 'email'});
            })
            .catch(function (error) {
                let errorCode = error.code;
                let errorMessage = error.message;

                document.getElementById("error2").textContent = "Message: " + errorMessage + " Code: " + errorCode;
            });
    } else {
        document.getElementById("error2").textContent = "Bitte alle Felder ausfüllen";
    }
}
