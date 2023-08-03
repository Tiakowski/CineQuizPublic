//Código para exibição de senha
const passwordInput = document.getElementById('passwordInput');
const togglePasswordButton = document.getElementById('togglePasswordButton')

if(passwordInput){

  togglePasswordButton.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    togglePasswordButton.innerHTML = togglePasswordButton.innerHTML === '<i class="bi bi-eye-slash"></i>' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  });
  
  const passwordInputConfirmation = document.getElementById('passwordInputConfirmation');
  const togglePasswordButtonConfirmation = document.getElementById('togglePasswordButtonConfirmation')
  
  togglePasswordButtonConfirmation.addEventListener('click', () => {
      passwordInputConfirmation.type = passwordInputConfirmation.type === 'password' ? 'text' : 'password';
      togglePasswordButtonConfirmation.innerHTML = togglePasswordButtonConfirmation.innerHTML === '<i class="bi bi-eye-slash"></i>' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

}

function RotateLines(){
  line1 = document.getElementById("line1")
  line2 = document.getElementById("line2")
  line3 = document.getElementById("line3")

  line1.classList.toggle('line1Rotate');
  line2.classList.toggle('line2Rotate');
  line3.classList.toggle('line3Rotate');

}



const profilePic = document.getElementById('currentProfilePic');
const userName = document.getElementById('userName');

if(profilePic){
  profilePic.addEventListener('load', () => {
    // A imagem foi carregada completamente
    userName.style.display = 'block'; // Mostra o nome e sobrenome
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var ul = document.querySelector('.list-group');
  if(ul){
    ul.style.display = 'block';
  }
  
});

// document.addEventListener('DOMContentLoaded', function() {
//   var users = document.getElementById('users');
//   tableElement.setAttribute("v-if", "showUsers");

  
// });

  // Variável para controlar o timeout do debounce
 

const adminMode = document.getElementById('admin-mode');
const userMode = document.getElementById('user-mode');

adminMode.addEventListener('click', ()=>{
  const user = {
    email: 'recruiter@empresa.com',
    password: '12345678'
  }

  axios.post('/api/user/login', user, {
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(response=> {
      console.log(response);
      window.location.reload()
  }).catch(error => {
      console.log(error)
  })
  
})

userMode.addEventListener('click', () => {
  axios.get('/api/user/logout')
    .then(response => {
      console.log(response);
      // Atualiza a página após o logout bem-sucedido
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
});
