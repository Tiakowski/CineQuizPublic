var express = require("express")
var app = express();
var router = express.Router();
var UserController = require("../../controllers/UserController");
var FollowController = require("../../controllers/FollowController");
var MovieController = require("../../controllers/MovieController");
const FeedbackController = require("../../controllers/FeedbackController");
const validateRequest = require("../../middlewares/validateRequest");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const upload = require('../../middlewares/uploadMiddleware');
const authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
const HomeController = require("../../controllers/HomeController");
const MusicController = require("../../controllers/MusicController");


router.post('/user/create', validateRequest ,UserController.create);
router.post('/user/login', UserController.login);
router.post('/user/changepassword', isAuthenticated, UserController.changePassword);
router.post('/user/changename', isAuthenticated, UserController.changeName);
router.post('/user/changeprofilepic', isAuthenticated, upload.single("file"), UserController.changeProfilePic)
router.get('/user/logout', UserController.logout);
router.get('/user/profilepic/:userId', UserController.getProfilePic);
router.get('/user/search/:search', UserController.search);
router.get('/user/getallusers', authorizationMiddleware, UserController.getAllUsers);

//Follow

router.post('/user/follow/:username',isAuthenticated, FollowController.followUser);

//Quiz

router.get("/movies/getmovie/:id/:column", MovieController.getTip);
router.get("/movies/search/:search", MovieController.search);
router.get("/movies/verify/:id/:answer", MovieController.answer);
router.get("/movies/poster/:id", MovieController.poster);
router.get("/movies/title/:id", MovieController.title);
router.get("/movies/newrecord/:points", MovieController.record);

//Dashboard

router.post("/feedback/problem", FeedbackController.saveProblem);
router.post("/feedback/suggestion", FeedbackController.saveSuggestion);
router.post("/feedback/noposter", FeedbackController.saveProblem);
router.get("/feedback/getproblems", FeedbackController.getAllProblems);
router.get("/feedback/getsuggestions", FeedbackController.getAllSuggestions);
router.get("/feedback/getposters", FeedbackController.getAllPosters);
router.get("/feedback/deleteuser/:id/:role", authorizationMiddleware ,FeedbackController.dashboardDeleteUser);
router.get("/feedback/deletefeedback/:id", authorizationMiddleware ,FeedbackController.dashboardDeleteFeedback);
router.post("/role/changerole",authorizationMiddleware, UserController.changeRole)
router.get("/role/getrole/:id",authorizationMiddleware, UserController.getRole)

//Movies

router.post("/movie/edittitle", authorizationMiddleware, MovieController.editTitle)
router.post("/movie/editposter", authorizationMiddleware, MovieController.editPoster)
router.post("/movie/addmovie", authorizationMiddleware, MovieController.addMovie)
router.get("/movie/number", MovieController.getNumbers)
router.get("/movie/meta/:id", MovieController.getMeta)
router.get("/movie/dashboardgetmovie/:title", MovieController.getMovieDashboard)
router.post("/movie/attmovie",authorizationMiddleware, MovieController.attMovie)
router.post("/movie/daily/attmovie",authorizationMiddleware, MovieController.addDailyMovie)
router.get("/movie/getdailymovie", MovieController.getDailyMovie)
router.get("/movie/getalldailymovie",authorizationMiddleware, MovieController.getAllDailyMovies)

//Music
router.post("/movie/daily/addmusic",authorizationMiddleware, MusicController.addDailyMusic)
router.get("/music/search/:singer", MusicController.searchSingers)
router.get("/music/getalldailymusics", authorizationMiddleware, MusicController.getAllMusics)
router.get("/music/deletemusic/:id", authorizationMiddleware, MusicController.deleteMusic)
router.get("/music/getdailymusic", MusicController.getDailyMusic)
router.get("/music/gettip/:id/:tip", MusicController.getTip)
router.get("/music/verify/:id/:answer", MusicController.verify);
router.get("/music/singer/:id", MusicController.getSinger)
router.get("/music/title/:id", MusicController.getTitle)
router.get("/music/poster/:id", MusicController.getPoster)


module.exports = router;