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
    // const password = document.getElementById("password").value;
    // const passwordRepeat = document.getElementById("passwordRepeat").value;
    // if(password !== passwordRepeat){
    //     alert('La contraseña debe coincidir')
    // } else{
    //     const response = await postForgot(username, password);
    //     if(response.status == 'ok'){
    //         alert("Contrasena reiniciada", response)
    //         window.location.href = '/';
    //     } else {
    //         window.location.href = '/signup'
    //     }
    // }
    const response = await postForgot(username)
    console.log(response.status)
    if(response.status == 'ok'){
      const statusElem = document.createElement('p')
      statusElem.innerText = ' Su solicitud fue realizada con éxito, por favor revise su casilla de email y siga las instrucciones'
      statusElem.style.color = 'rgb(70 143 106)'
      statusElem.style.marginTop = '20px'
      forgotForm.append(statusElem)
    }
  });
  

