let currentCartID;
let frontUser;

async function getCartId(frontUser) {
  currentCartID = localStorage.getItem("cartIdStored");
  storedUser = localStorage.getItem('storedUser');

  
  if (!currentCartID || frontUser != storedUser) { 
      const res = await fetch("/cart", {
          method:"POST",
      });
      const data = await res.json();
      currentCartID = await data.data._id;
      localStorage.setItem('storedUser', frontUser)
      localStorage.setItem("cartIdStored",currentCartID)
  }
  return currentCartID;
}


async function postSignup(first_name, last_name, age, username, password, currentCartID) {
  const data = {
    first_name,
    last_name,
    age,
    email: username,
    password,
    currentCartID
  };

  const response = await fetch("/api/session/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log('result[signup.js]' + result)
  return result;
}

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const age = document.getElementById("age").value;
  currentCartID = await getCartId(username);
  

  const res = await postSignup(first_name, last_name, age, username, password, currentCartID) 
  if (res.status == 'ok'){
    window.location.href = '/products'
  }
  else{
    window.location.reload();
  }
  
  ;
});
