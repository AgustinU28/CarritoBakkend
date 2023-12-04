const errorLogin = document.querySelector('.error-login');
const loginForm = document.getElementById("login-form");
const userInput = document.getElementById("username");
const passInput = document.getElementById("password");
const userLabel = document.getElementById('login-username-label')
const passLabel = document.getElementById('login-password-label')

let currentCartID;
let frontUser;

async function postLogin(username, password, currentCartID) {
  try {
    const response = await fetch("/api/session/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, currentCartID }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log({result})
      return result;
    }
    return response;
  } catch (error) {
    console.log(error)
    return {'status':"Not ok"}
  }
}

async function getCartId(frontUser) {
  currentCartID = localStorage.getItem("cartIdStored");
  storedUser = localStorage.getItem('storedUser');
  
  if (!currentCartID || frontUser != storedUser) { 
      const res = await fetch("/cart", {
          method:"POST",
      });
      const data = await res.json();
      console.log(data)
      currentCartID = await data.payload._id;
      localStorage.setItem('storedUser', frontUser)
      localStorage.setItem("cartIdStored",currentCartID)
  }
  return currentCartID;
}

userInput.addEventListener('keyup', e =>{
  if(errorLogin.style.display == 'block')  errorLogin.style.display = 'none';
  userInput.value === '' ? userLabel.style.visibility = 'hidden' : userLabel.style.visibility = 'visible';
})

passInput.addEventListener('keyup', e =>{
  if(errorLogin.style.display == 'block') errorLogin.style.display = 'none'
  passInput.value === '' ? passLabel.style.visibility = 'hidden' : passLabel.style.visibility = 'visible';
})

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  currentCartID = await getCartId(username);
  const response = await postLogin(username, password, currentCartID);
  if(response.status === 'ok'){
    window.location.href = '/products';
  } else {
    errorLogin.style.display = 'block'
  }
});


const registerBtn = document.getElementById('registrate');

registerBtn.addEventListener('click', e => {
    window.location.href = '/signup'
})


const forgotPassBtn = document.getElementById('forgotPass');

forgotPassBtn.addEventListener('click', e => {
    window.location.href = '/forgot'
})