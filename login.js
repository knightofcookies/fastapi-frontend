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

const base_url = "https://reqres.in/api";
const endpoint = "login";

async function login(email, password) {
    const credentials = {
        email: email,
        password: password
    };
    fetch(`${base_url}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(credentials)
    }).then((response) => {
        if (response.ok) {
            json = response.json();
            token = json.token;
            console.log(token);
        }
        else {
            errorArea.textContent = "HTTP-Error: " + response.status +" ";
            return response.text().then(text => {throw new Error(text)});
        }
    }).catch((e) => {
        console.log(e);
        errorArea.textContent += e;
    });
}
