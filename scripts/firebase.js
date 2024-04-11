//import bcrypt from '../node_modules/bcryptjs/src/bcrypt.js';
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCZ0u07mduZkIHqwCXJOw5pGRFcTVrXxSc",
    authDomain: "sypgroup05.firebaseapp.com",
    projectId: "sypgroup05",
    storageBucket: "sypgroup05.appspot.com",
    messagingSenderId: "803117364447",
    appId: "1:803117364447:web:a367aeac3f8b570db3256a",
    measurementId: "G-3C4R5ZM8ZX",
    databaseURL: "https://sypgroup05-default-rtdb.europe-west1.firebasedatabase.app"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  import {getDatabase, ref, set, child, update, remove, get, orderByChild, equalTo}
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"

  const db = getDatabase();

  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword}
  from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
  
  // Assuming you have already initialized your Firebase app and obtained the 'db' reference.
  
  export async function postUser(username, email, password) {
    try {
      if (!email || !password) {
        console.error('Email and password are required for login.');
        return false;
      }
      // Create user in Firebase Authentication
      const auth = getAuth();
      // Store additional user data in the Realtime Database
      set(ref(db, "User/"+username), {
        password: password,
        username: username,
        email: email
      })
      console.log('User registered successfully!');
      return true;
    } catch (error) {
      console.error('Error registering user:', error.message);
      return false;
    }
  }

  export async function checkUserAvailability(username, email) {
    const usersRef = ref(db, 'User/'+username);
    const usernameQuery = child(usersRef, 'username');
    const emailQuery = child(usersRef, 'email');
  
    // Check if username already exists
    const usernameSnapshot = await get(usernameQuery);
    if (usernameSnapshot.exists()) {
      return false;
    }
  
    // Check if email already exists
    const emailSnapshot = await get(emailQuery);
    if (emailSnapshot.exists()) {
      return false;
    }
  
    // If both username and email are available
    return true;
  }

//Function to hash a plaintext password during registration
/*function hashPassword(plaintextPassword) {
  const hash = bcrypt.hashSync(plaintextPassword, 10);
  return hash;
}

// Function to verify a plaintext password during login
function verifyPassword(enteredPassword, storedHashedPassword) {
  return bcrypt.compareSync(enteredPassword, storedHashedPassword);
}*/

export async function loginUser() {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `User/${username}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}