//import Firebase-Funktionen
import {initializeApp} from "../librarys/firebase/firebase-app.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../librarys/firebase/firebase-auth.js";

//import Firebase/Google-Analytics
import {initializeAnalytics} from "../librarys/firebase/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuEMb5P46AJKw_poFaXjmJRz62FlFM1hM",
    authDomain: "sypgroup5.firebaseapp.com",
    projectId: "sypgroup5",
    storageBucket: "sypgroup5.appspot.com",
    messagingSenderId: "65548177393",
    appId: "1:65548177393:web:31488286c5af20d1be7e50",
    measurementId: "G-7DDBJX9VBT"
};

//Firebase initialisieren
const app = initializeApp(firebaseConfig);

//Analytics initialisieren
const analytics = initializeAnalytics(app);

//User einloggen & in Analytics aufnehmen
export function logInWithFirebase(event) {
    event.preventDefault();
    const email = document.getElementById("email_log").value;
    const password = document.getElementById("passw_log").value;

    if (email !== "" && password !== "") {
        signInWithEmailAndPassword(email, password)
            .then(() => {
                //Login in Analytics loggen
                analytics.logEvent('login', {method: 'email'});
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;

                document.getElementById("error1").textContent = "Message: " + errorMessage + " Code: " + errorCode;
            });
    }
}

// User registrieren & in Analytics aufnehmen
export function registerWithFirebase(event) {
    event.preventDefault();
    const email = document.getElementById("email_reg").value;
    const password = document.getElementById("passw_reg").value;
    const agreedToTermsAndConditions = document.getElementById("terms").checked;

    //Überprüfen, obn die "Terms & Conditions" akzeptiert wurden
    if (!agreedToTermsAndConditions) {
        document.getElementById("error2").textContent = "Bitte die Terms & Conditions akzeptieren";
    } else if (email !== "" && password !== "") {
        createUserWithEmailAndPassword(email, password)
            .then(() => {
                //Registration in Analytics loggen
                analytics.logEvent('register', {method: 'email'});
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;

                document.getElementById("error2").textContent = "Message: " + errorMessage + " Code: " + errorCode;
            });
    }
}
