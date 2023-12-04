const userInput = document.getElementById("username");
const userLabel = document.getElementById('login-username-label')
async function postForgot(username) {
    const response = await fetch("/api/session/forgotbtn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  
    const result = await response.json();
    return result;
  }
  
  const forgotForm = document.getElementById("forgot-form");
  const forgotContainer = document.querySelector(".forgot-container");
  
  forgotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const response = await postForgot(username)
    if(response.status == 'ok'){
      const statusElem = document.createElement('p')
      statusElem.innerText = ' Su solicitud fue realizada con éxito, por favor revise su casilla de email y siga las instrucciones'
      statusElem.style.color = 'rgb(70 143 106)'
      statusElem.style.marginTop = '20px'
      forgotForm.append(statusElem)
    }
  });

