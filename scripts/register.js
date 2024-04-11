import {postUser, checkUserAvailability} from "./firebase.js"

export async function registerUser() {
    const username = document.getElementById('name_reg').value;
    const email = document.getElementById('email_reg').value;
    const password = document.getElementById('passw_reg').value;
    const error = document.getElementById('error2');
    const terms = document.getElementById('terms');


    const availability = await checkAvailability(username, email);

    //Handle Register Success 
    if(!terms.checked) {
        error.textContent = "Agree to the Terms & Conditions!";
        return false;
    }
    if(password.length < 8) {
        error.textContent = "Password atleast 8 Characters!";
        return false;
    }
    if (availability) {
        try {
            console.log(availability);
            // Make a POST request to register the user
            let response = await postUser(username,email,password);
            if (response) {
                console.log("HAHAHAHHA");
                return true;
             } else {
                 console.error("Whoops, something went wrong!");
                  return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    } else {
        error.textContent = "Username or Email is already in Use!";
        console.log(error);
    }

  return false;
}

export async function checkAvailability(username, email) {
    try {
      let result = await checkUserAvailability(username, email);
      return result;
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }
  

