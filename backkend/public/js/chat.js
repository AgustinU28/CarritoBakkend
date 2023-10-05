  // APPchat

  const socket = io();

  let user;
  let chatBox = document.getElementById('chatBox');
  let chatSection = document.querySelector('.chatSection');
  let sendingBox = document.querySelector('.sendingBox');
  const username = document.querySelector('.username');
  const msgSender = document.querySelector('.fa-circle-chevron-right');

  
  Swal.fire({
      title:"Bienvenido!",
      text:"Ingresa tu usuario",
      input:"text",
      inputValidator: (value) =>{
          return !value && '¡Necesitás escribir un nombre de usuario para ingresar'
      },
      allowOutsideClick:false
  }).then(result=>{
      user=result.value;
      username.innerHTML = `${user}`;
      socket.emit('newUserConnected',user);
      
      scrollToBottom()
  });
  
  chatBox.addEventListener('keyup', e=>{
      if (e.key === "Enter") {
          if(chatBox.value.trim().length > 0){
              socket.emit('message',{user:user, message:chatBox.value})
              chatBox.value="";
          }
      }
  })
  msgSender.addEventListener('click', e=>{
    if(chatBox.value.trim().length > 0){
        socket.emit('message',{user:user, message:chatBox.value})
        chatBox.value="";
  }
})

  socket.on('newUserConnected', user =>{
    Swal.fire({
        text:`${user} se ha conectado`,
        toast:true,
        position:"top-right"
    })
})
socket.on('messageLogs', data =>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    log.innerHTML = "";
    data.forEach(message => {
      let messageDiv = document.createElement('DIV');
      message.user == user ? messageDiv.classList.add('myUserMsg') : messageDiv.classList.add('userMsg')
      messageDiv.innerHTML = `<span class="name">${message.user}</span><i class="fa-solid fa-chevron-right"></i> <span class="message">${message.message}</span>`;
      log.append(messageDiv)
    });
    scrollToBottom()
})

function scrollToBottom() {
    chatSection.scrollTop = chatSection.scrollHeight;
  }

chatBox.addEventListener('focusin',()=>{
    sendingBox.classList.toggle('active')
})
chatBox.addEventListener('focusout',()=>{
    sendingBox.classList.toggle('active')
})

