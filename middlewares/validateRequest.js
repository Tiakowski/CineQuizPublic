function validateRequest(req, res, next) {
    var { email, name, password, surname, confirmationPassword, username } = req.body;
  
    const createErrors = { name: null,username: null, surname: null, email: null, senha: null, system: null };
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
  
    if (!emailPattern.test(email)) {
      createErrors.email = "Email inválido";
    }
  
    if (!password || password.length < 8) {
      createErrors.senha = "A senha deve ter pelo menos 8 caracteres";
    }

    if(!usernamePattern.test(username)) {
      createErrors.username = "Username inválido"
    }
  
    if (!namePattern.test(name)) {
      createErrors.name = "Nome inválido";
    }
  
    if (!namePattern.test(surname)) {
      createErrors.surname = "Sobrenome inválido";
    }

    if(password !== confirmationPassword){
      createErrors.senha = "As senhas não coincidem";
    }
  
    const hasErrors = Object.values(createErrors).some((error) => error !== null);
  
    if (hasErrors) {
      res.statusCode = 400;
      req.flash("error", createErrors);
      res.render("auth/register", { createErrors });
      return;
    }
  
    // Se a validação for bem-sucedida, chame next() para prosseguir para o próximo middleware ou controlador
    next();
  }
  
  module.exports = validateRequest;
  