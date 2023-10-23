const loginForm = document.getElementById('login-form');
const registerRedirect = document.getElementById('register-redirect');

addEventListener("DOMContentLoaded", (event) => {
    checkCredentials().then((isLoggedIn) => {
        if(isLoggedIn) {
            showLoggedInStatus();
        }
    }).catch(console.log);
});

const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');
const errorMessage = document.getElementById('login-error-message');

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    login(email, password);
});

const base_url = "http://127.0.0.1:8000";
const endpoint = "login";

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

async function login(email, password) {
    const credentials = {
        email: email,
        password: password
    };
    const data = new FormData();
    data.append("username", email);
    data.append("password", password);
    fetch(`${base_url}/${endpoint}`, {
        method: 'POST',
        body: data,
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
    loggedInParagraph.innerHTML = "You're logged in!";
    const loggedInImage = document.createElement("img");
    loggedInImage.src = "styles/check-circle-fill.svg";
    loggedInImage.style.height = "5vh";
    loggedInImage.style.width = "5vw";
    loggedInImage.style.marginTop = "5vh";
    loggedInDiv.appendChild(loggedInParagraph);
    loggedInDiv.appendChild(loggedInImage);
    loginForm.replaceWith(loggedInDiv);

    registerRedirect.textContent = "Logout";
    registerRedirect.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}

function logout() {
    localStorage.removeItem("access_token");
    location.reload();
}