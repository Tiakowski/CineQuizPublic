const jwt = require('jsonwebtoken');


// Middleware de autenticação
const authenticationMiddleware = (req, res, next) => {
  // Verificar se o token está presente no cookie da requisição
  const token = req.cookies.token;
  const secret = "segredo";
  res.locals.role = 0
  
 

  function verifyToken(token, secret) {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded) {
        const role = decoded.role;
        const userId = decoded.userId;
        req.userId = userId;
        res.locals.role = role
      }
      return decoded ? true : false;
    } catch (err) {
      // O token é inválido ou expirou
      return false;
    }
  }

  // Definir a variável isAuthenticated em res.locals
  res.locals.isAuthenticated = verifyToken(token, secret);
  

  next();
};

module.exports = authenticationMiddleware;
