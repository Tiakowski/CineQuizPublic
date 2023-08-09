var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../../controllers/HomeController");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const blockIfAuthenticated = require("../../middlewares/blockIfAuthenticated");
const authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
const MovieController = require("../../controllers/MovieController");


router.get('/', HomeController.home);
router.get('/movies/quiz', HomeController.index);
router.get('/recordes',HomeController.records);
router.get('/user/register',blockIfAuthenticated, HomeController.register);
router.get('/user/login',blockIfAuthenticated, HomeController.login);
router.get('/user/myprofile',isAuthenticated, HomeController.myprofile);
router.get('/user/settings',isAuthenticated, HomeController.settings);
router.get('/user/profile/:username',HomeController.profile);
router.get("/problems", HomeController.problems)
router.get("/noposter", HomeController.noposter)
router.get("/suggestions", HomeController.suggestion)
router.get("/dashboard", authorizationMiddleware, HomeController.dashboard)
router.get("/moviescontrol", authorizationMiddleware, HomeController.moviesControl)
router.get("/daily/music", HomeController.dailyMusic)
router.get("/daily/movie", HomeController.dailyMovie)
router.get("/dailycontrol",authorizationMiddleware, HomeController.dailyControl)




module.exports = router;