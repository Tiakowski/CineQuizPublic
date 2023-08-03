var User = require("../models/User");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs')


class UserController{
    async create(req, res){
        var {email, name,surname, username, password} = req.body;
        console.log(email, name, surname, password, username)
        var createResult = await User.new(email,name,surname, password, username);

        if(!createResult.status){
            const createErrors = {system: createResult.error};
            req.flash("error", createResult.error);
            res.render("auth/register", { createErrors });
        } else {
            var loginResult = await User.login(email, password);
            const days = 15;
            const msPerDay = 24 * 60 * 60 * 1000; // Um dia tem 24 horas, cada hora tem 60 minutos, cada minuto tem 60 segundos, cada segundo tem 1000 milissegundos
            const lifeTime = days * msPerDay;
            const token = jwt.sign({ userId: loginResult.id, role: loginResult.role}, 'segredo', { expiresIn: lifeTime });
            res.cookie('token', token, { maxAge: lifeTime, httpOnly: true });
            res.redirect("/");
        }
    }
    

    async changeProfilePic(req, res){
       console.log("OI");
       res.send("chegou");
    }

    async getProfilePic(req, res){
        const userId = req.params.userId;
        const imagePath = path.join(__dirname,".." ,'uploads', `${userId}-profilepic.jpg`);
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
              // O arquivo não existe, enviar imagem de perfil padrão
              const defaultImagePath = path.join(__dirname, "..", "uploads", "noprofilepic.png");
              res.sendFile(defaultImagePath);
            } else {
              // O arquivo existe, enviar a imagem do perfil
              res.sendFile(imagePath);
            }
          });
        
    }

    async search(req, res){
        const search = req.params.search;
        const users = await User.findByUsernameSearch(search);
        res.json(users);
    }

    async login(req, res){
        var {email, password} = req.body;
        var loginResult = await User.login(email, password);

        if (!loginResult.status) {
            const loginErrors = { system: loginResult.error };
            req.flash("error", loginResult.error);
            res.render("auth/login", {loginErrors});
          } else {
            const days = 15;
            const msPerDay = 24 * 60 * 60 * 1000; // Um dia tem 24 horas, cada hora tem 60 minutos, cada minuto tem 60 segundos, cada segundo tem 1000 milissegundos
            const lifeTime = days * msPerDay;
            const token = jwt.sign({ userId: loginResult.id, role: loginResult.role}, 'segredo', { expiresIn: lifeTime });
            res.cookie('token', token, { maxAge: lifeTime, httpOnly: true });
            res.redirect("/");
        }

    }

    async logout(req, res){
        res.clearCookie('token');
        res.redirect("/");
    }

    async changePassword(req, res){
        if(res.locals.isAuthenticated){
            var {newPassword, newPasswordConfirmation} = req.body;
            var passwordResult = await User.editPassword(newPassword, newPasswordConfirmation, req.userId);

            if(!passwordResult.status){
                req.flash("passwordError", passwordResult.error);
                res.render("profile/settings", {error: passwordResult.error});
            } else {
                res.redirect("/");
            }
        } else {
            res.redirect("/user/login");
        }
    }

    async changeName(req, res){
        if(res.locals.isAuthenticated){
            const {name, surname} = req.body;
            const nameResult = await User.editName(name, surname, req.userId)
            res.redirect("/user/myprofile");
        } else {
            res.redirect("/user/login")
        }
    }

    async getAllUsers(req, res){
        try {
            const users = await User.getAllUsers()
            res.json(users)
        } catch (error) {
            console.log(error)
        }
    }

    async getRole(req, res){
        const id = req.params.id;
        const role = await User.getRole(id)
        res.json(role)
    }

    async changeRole(req, res){
        const userRole = res.locals.role;
        const {id, role} = req.body;
        console.log(id, role, userRole)
        try {
            await User.changeRole(id, role, userRole)
            res.status(200).send("Ok");
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new UserController();