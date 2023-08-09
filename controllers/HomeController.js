var User = require("../models/User");
var Follow = require("../models/Follow");
const Movies = require("../models/Movies")



class HomeController{

    async home(req, res){
        var userId = req.userId;
        if(userId){
            var user = await User.findById(req.userId);
            if (user) {
                delete user.password;
                delete user.username_uppercase;
                delete user.email;  
            }  
        } else {
            var user = null
        }
        res.render("home",{user, isAuthenticated: res.locals.isAuthenticated } )
    }

    async index(req, res){
        var userId = req.userId;
        if(userId){
            var user = await User.findById(req.userId);
            if (user) {
                delete user.password;
                delete user.username_uppercase;
                delete user.email;  
            }  
        } else {
            var user = null
        }
        res.render("index",{user, isAuthenticated: res.locals.isAuthenticated } )
    }

    async error404(req, res){
        res.status(404).render('404', {url: req.url, isAuthenticated: res.locals.isAuthenticated  });
    }

    async dashboard(req, res){
        res.render("dashboard")
    }

    async moviesControl(req, res){
        res.render("moviesControl")
    }

    async dailyMusic(req, res){
        var userId = req.userId;
        if(userId){
            var user = await User.findById(req.userId);
            if (user) {
                delete user.password;
                delete user.username_uppercase;
                delete user.email;  
            }  
        } else {
            var user = null
        }
        res.render("daily/music", {user, isAuthenticated: res.locals.isAuthenticated })
    }

    async dailyMovie(req, res){
        var userId = req.userId;
        if(userId){
            var user = await User.findById(req.userId);
            if (user) {
                delete user.password;
                delete user.username_uppercase;
                delete user.email;  
            }  
        } else {
            var user = null
        }

        res.render("daily/movie", {user, isAuthenticated: res.locals.isAuthenticated })
    }

    async dailyControl(req, res){
        res.render("dailyControl")
    }


    async records(req, res){
        const users = await Movies.getRecords();
        res.render("records",{users});
    }

    async register(req, res){
        res.render("auth/register");
    }

    async login(req, res){
        res.render("auth/login");
    }

    async myprofile(req, res){
        const user = await User.findById(req.userId);
        
        const followers = await Follow.getFollowers(user.id);
        const following = await Follow.getFollowing(user.id);
        const numberFollowers = followers.length
        const numberFollowing = following.length
        
        delete user.password, 
        delete user.username_uppercase;
        res.render("profile/myprofile", {user, numberFollowers, numberFollowing});
    }

    async profile(req, res){
        const userId = req.userId;  //UserID -> Usuario que está logado
        var username = req.params.username;
        var user = await User.findByUsername(username); //User -> Usuario do perfil
        if(!user){
            return res.status(404).render('error404', {url: req.url, isAuthenticated: res.locals.isAuthenticated  });
        } 

        var isFollowing = false
        const followers = await Follow.getFollowers(user.id);
        const following = await Follow.getFollowing(user.id);

        const usersFollowing = await User.getUsersByIds(following,'user_following');
        const usersFollowers = await User.getUsersByIds(followers, 'user_followed');

        const numberFollowers = followers.length
        const numberFollowing = following.length
        if(userId){
            isFollowing = await Follow.isFollowing(userId, username);
        }
        
        if(user){
            delete user.password;
            delete user.username_uppercase;
            delete user.email;

            res.render("profile/profile", {user, userId, isFollowing, numberFollowers, numberFollowing, usersFollowers, usersFollowing})
        } else {
            res.redirect("/")
        }
    }

    async settings(req, res){
        const user = await User.findById(req.userId)
        delete user.password, user.id;
        res.render("profile/settings", {user});
    }

    async problems(req, res){
        res.render("feedback/problem")
    }

    async noposter (req, res){
        res.render("feedback/noposter")
    }

    async suggestion (req, res){
        res.render("feedback/suggestion")
    }


}

module.exports = new HomeController();