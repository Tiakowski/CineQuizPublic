var express = require("express");
var bodyParser = require('body-parser');
var flash = require("express-flash");
var cookieParser = require('cookie-parser');
var clientRouter = require("./routes/client/clientRouter");
var apiRouter = require("./routes/api/apiRouter");
const path = require('path');
const session = require('express-session');
var authenticationMiddleware = require("./middlewares/authenticationMiddleware");

var app = express();

app.set("view engine","ejs");




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(flash());

// Configuração do cookie-parser e da sessão
app.use(cookieParser("chave_secreta"));
const days = 15;
const msPerDay = 24 * 60 * 60 * 1000; // Um dia tem 24 horas, cada hora tem 60 minutos, cada minuto tem 60 segundos, cada segundo tem 1000 milissegundos
const lifeTime = days * msPerDay;


app.use(session({
    secret: 'chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: lifeTime } // Expira em 1 hora
}));


app.use(express.static('public'));

app.use(authenticationMiddleware);


// Roteador para a API
app.use("/api",apiRouter);

// Roteador para o cliente
app.use("/", clientRouter);


app.use(function(req, res, next) {
    res.render('error404',{ url: req.url })
});

app.listen(process.env.PORT || 3000,() => {
    console.log("Servidor rodando")
});
