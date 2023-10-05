async function postForgot(username, password) {
    const response = await fetch("/api/session/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.json();
    return result;
  }
  
  const forgotForm = document.getElementById("forgot-form");
  
  forgotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;
    if(password !== passwordRepeat){
        alert('La contraseña debe coincidir')
    } else{
        const response = await postForgot(username, password);
        if(response.status == 'ok'){
            alert("Contrasena reiniciada", response)
            window.location.href = '/';
        } else {
            window.location.href = '/signup'
        }
    }

  });
  

