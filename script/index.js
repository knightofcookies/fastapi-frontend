addEventListener("DOMContentLoaded", (event) => {
    checkCredentials().then((isLoggedIn) => {
        if (isLoggedIn) {
            showLoggedInStatus();
        }
    }).catch(console.log);
});

const base_url = "http://127.0.0.1:8000";

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
        if (response.ok) {
            return true;
        }
        else {
            return false;
        }
    }).catch((error) => {
        console.log(error);
    });
}

function showLoggedInStatus() {
    const logoutLink = document.createElement("a");
    logoutLink.textContent = "Logout";
    logoutLink.href = "index.html";
    logoutLink.className = "auth-redirect";
    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });

    const logoutDiv = document.createElement("div");
    logoutDiv.className = "auth-element";
    logoutDiv.appendChild(logoutLink);

    
    const newAuthDiv = document.createElement("div");
    newAuthDiv.className = "auth";
    newAuthDiv.appendChild(logoutDiv);

    const oldAuthDiv = document.getElementById("auth");
    oldAuthDiv.replaceWith(newAuthDiv);
}

function logout() {
    localStorage.removeItem("access_token");
    location.reload();
}