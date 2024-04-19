//Firebase
import {initializeApp} from "../librarys/firebase/firebase-app.js";
import {getAuth} from "../librarys/firebase/firebase-auth.js";
import {getDatabase} from "../librarys/firebase/firebase-database.js"

//Analytics
import { getAnalytics } from "../librarys/firebase/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDhmFz-jAoBpjQ4DkLx_Uz-uzi17Qr0j-0",
    authDomain: "syp-group5-4ahinf.firebaseapp.com",
    projectId: "syp-group5-4ahinf",
    storageBucket: "syp-group5-4ahinf.appspot.com",
    messagingSenderId: "224277553804",
    appId: "1:224277553804:web:48b9aa869c407655cd91a9",
    measurementId: "G-E7VRTLQQHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Authentication
const auth = getAuth(app);

//Initialize Database
const database = getDatabase(app);

//Initialize Analytics
const analytics = getAnalytics(app);


//Login
function logInWithFirebase() {
    let email = document.getElementById("email_log").value();
    let password = document.getElementById("passw_log").value();

    if (email !== "" && password !== "") {
        let result = auth./*HIER FUNKTION ZUM EINLOGEGEN AUFRUFEN*/(email, password);

        result.catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;

            document.getElementById("error1").text("Message: " + errorMessage + " Code: " + errorCode);
        });
    } else {
        document.getElementById("error1").text("Bitte alle Felder ausfüllen");
    }
}

//Register
function registerWithFirebase() {
    let email = document.getElementById("email_reg").value();
    let password = document.getElementById("passw_reg").value();

    if (email !== "" && password !== "") {
        let result = auth./*HIER FUNKTION ZUM REGISTRIEREN AUFRUFEN*/(email, password);

        result.catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;

            document.getElementById("error2").text("Message: " + errorMessage + " Code: " + errorCode);
        });
    } else {
        document.getElementById("error2").text("Bitte alle Felder ausfüllen");
    }
}
