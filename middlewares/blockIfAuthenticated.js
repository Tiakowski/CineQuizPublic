const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded ? true : false;
  } catch (err) {
    // O token é inválido ou expirou
    return false;
  }
}


function blockIfAuthenticated(req, res, next) {
  const token = req.cookies.token;
  const secret = "segredo";

  if (verifyToken(token, secret)) {
    return res.redirect('/');
  }

  // Continuar para o próximo middleware se o usuário não estiver autenticado
  next();
}

module.exports = blockIfAuthenticated;
