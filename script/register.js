const registerForm = document.getElementById('register-form');
const loginRedirect = document.getElementById('login-redirect');

addEventListener("DOMContentLoaded", (event) => {
    checkCredentials().then((isLoggedIn) => {
        if(isLoggedIn) {
            showLoggedInStatus();
        }
    }).catch(console.log);
});

const registerButton = document.getElementById('register-button');
const registerEmail = document.getElementById('email');
const registerPassword = document.getElementById('password');
const errorMessage = document.getElementById('register-error-message');

registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = registerEmail.value;
    const password = registerPassword.value;
    register(email, password);
});

const base_url = "http://127.0.0.1:8000";
const endpoint = "users";

async function checkCredentials() {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
        return false;
    }
    return fetch(`${base_url}/login`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${access_token}`,
        },
    }).then((response) => {
        if(response.ok) {
            return true;
        }
        else {
            return false;
        }
    }).catch((error) => {
        console.log(error);
    });
}

async function register(email, password) {
    const credentials = {
        email: email,
        password: password
    };
    fetch(`${base_url}/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((response) => {
        if (response.ok) {
            json = response.json().then((json) => {
                if(typeof(Storage) === "undefined") {
                    throw new Error("Login failed! Your browser does not support LocalStrorage!");
                }
                else {
                    localStorage.setItem("access_token", json.access_token);
                    showLoggedInStatus();
                }
            });
        }
        else {
            errorMessage.textContent = "HTTP-Error: " + response.status + " ";
            return response.text().then(text => { throw new Error(text) });
        }
    }).catch((e) => {
        errorMessage.textContent += e;
    });
}

function showLoggedInStatus() {
    const loggedInDiv = document.createElement("div");
    loggedInDiv.className = "logged-in";
    const loggedInParagraph = document.createElement("p");
    loggedInParagraph.innerHTML = "You're registered and logged in!";
    const loggedInImage = document.createElement("img");
    loggedInImage.src = "styles/check-circle-fill.svg";
    loggedInImage.style.height = "5vh";
    loggedInImage.style.width = "5vw";
    loggedInImage.style.marginTop = "5vh";
    loggedInDiv.appendChild(loggedInParagraph);
    loggedInDiv.appendChild(loggedInImage);
    registerForm.replaceWith(loggedInDiv);

    loginRedirect.textContent = "Logout";
    loginRedirect.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}

function logout() {
    localStorage.removeItem("access_token");
    location.reload();
}