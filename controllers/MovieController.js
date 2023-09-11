var Movies = require("../models/Movies");

class MovieController{
    async search(req, res){
        const search = req.params.search;
        const movies = await Movies.findByTitleSearch(search);
        res.json(movies);
    }

    async getTip(req, res){
        const id = req.params.id;
        const column = req.params.column;
        const tip = await Movies.getMovieById(id, column)
        res.json(tip)
    }

    async answer(req, res){
        const id = req.params.id;
        const answer = req.params.answer;
        const result = await Movies.verifyAnswer(id, answer)
        res.json(result)
    }

    async poster(req, res){
        const id = req.params.id;
        const poster = await Movies.getPost(id)
        res.json(poster)
    }

    async title(req, res){
        const id = req.params.id;
        const title = await Movies.getTitle(id)
        res.json(title)
    }

    async record(req, res){
        const userId = req.userId;
        const points = req.params.points;
        try {
            await Movies.newRecord(userId, points);
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500)
        }

    }

    async getMeta(req, res){
        const id = req.params.id
        try {
            const meta = await Movies.getMeta(id)
            console.log(meta)
            res.json(meta)
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }

    async getMovieDashboard(req, res){
        const title = req.params.title
        const movie = await Movies.getFullMovie(title)
        res.json(movie)
    }

    async editTitle(req, res){
        const title = req.body.title;
        const newTitle = req.body.newTitle
        await Movies.editTitle(title, newTitle);
        res.redirect("/moviescontrol");
    }

    async editPoster(req, res){
        const title = req.body.title;
        const poster = req.body.poster;
        console.log(title, poster)
        await Movies.editPoster(title, poster);
        res.redirect("/moviescontrol");
    }

    async getNumbers(req, res){
        const number = await Movies.moviesNumber()
        res.json(number)
    }

    async addMovie(req, res){
        const {title, title_uppercase, title_no_accent, runtime, 
            genre, metascore, director, actor1, actor2,
            actor3, actor4, year, poster} = req.body;

            const movie = { title, title_uppercase, title_no_accent,
                runtime, genre, metascore, director,
                actor1, actor2, actor3,
                actor4, year, poster
            };
        await Movies.createMovie(movie);
        res.redirect("/moviescontrol");
    }

    async attMovie(req, res){
        var movie = req.body
        const result = await Movies.attMovie(movie.title, movie)
        if(result){
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }

    async addDailyMovie(req, res){
        const movie = req.body
        console.log(movie)
        const result = await Movies.addDailyMovie(movie)
        if(result){
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }

    async getDailyMovie(req, res){
        const movie = await Movies.dailyMovie()
        console.log(movie)
        if(movie){
            res.json(movie.id_movie)
        } else {
            res.json(null)
        }
        
    }

    async getAllDailyMovies(req, res){
        const movies = await Movies.getAllDailyMovies()
        res.json(movies)
    }

    async deleteDailyMovie(req, res){
        const id = req.params.id
        console.log(id)
        const result = await Movies.deleteDailyMovie(id)
        res.sendStatus(result.statusCode)
    }

    
    

    
}

module.exports = new MovieController();