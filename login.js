const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');
const errorArea = document.getElementById('login-error-message');

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    login(email, password);
});

const base_url = "http://127.0.0.1:8000";
const endpoint = "login";

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
                var now = new Date();
                now.setTime(now.getTime() + 1 * 3600 * 1000);
                document.cookie = `access_token=${json.access_token}; expires=${now.toUTCString()};`
            });
        }
        else {
            errorArea.textContent = "HTTP-Error: " + response.status + " ";
            return response.text().then(text => { throw new Error(text) });
        }
    }).catch((e) => {
        errorArea.textContent += e;
    });
}
