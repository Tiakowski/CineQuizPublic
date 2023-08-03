var knex = require("../DAO/connection");
const { DateTime } = require('luxon');

class Movies {
    async getMovieById(id, column){
        if(column == "star1"){
            var movie = await knex.select(['star1','star2']).where({id:id}).table("movies").first();
        if (movie){
            return movie
        } else {
            return null;
        }
        } else if(column == "star2"){
            var movie = await knex.select(['star3','star4']).where({id:id}).table("movies").first();
            if (movie){
                return movie
            } else {
                return null;
            }
        } else{
            var movie = await knex.select([column]).where({id:id}).table("movies").first();
            if (movie){
                return movie
            } else {
                return null;
            }
        }
    }

    async getFullMovie(title){
       const movie = await knex("movies").select("*").where({title:title}).first()
       return movie
    }

    async createMovie(movie){
        try {
            console.log(movie.genre)
            await knex.insert({
                poster_backup: '',
                poster: movie.poster,
                title: movie.title,
                title_uppercase: movie.title_uppercase,
                year: movie.year,
                runtime: movie.runtime,
                genre: movie.genre,
                meta_score: movie.metascore,
                director: movie.director,
                star1: movie.actor1,
                star2: movie.actor2,
                star3: movie.actor3,
                star4: movie.actor4,
                no_accent: movie.title_no_accent
              }).table("movies");
        } catch (error) {
            console.log(error)
        }
        
    }

    async attMovie(title,movie){
        try {
            console.log(movie)
            const update = await knex("movies").where({title:title}).update({
                poster_backup: '',
                poster: movie.poster,
                title_uppercase: movie.title_uppercase,
                year: movie.year,
                runtime: movie.runtime,
                genre: movie.genre,
                meta_score: movie.metascore,
                director: movie.director,
                star1: movie.actor1,
                star2: movie.actor2,
                star3: movie.actor3,
                star4: movie.actor4,
                no_accent: movie.title_no_accent
            })
            return update > 0
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async getPost(id){
        var movie = await knex.select("poster").where({id:id}).table("movies").first();
            if (movie){
                return movie
            } else {
                return null;
            }
    }

    async getTitle(id){
        var movie = await knex.select("title").where({id:id}).table("movies").first();
        if (movie){
            return movie
        } else {
            return null;
        }
    }

    async editTitle(title, newTitle){

        const regexUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        if(regexUrl.test(title) || regexUrl.test(newTitle)){
            return false
        }

        try {
            const no_accent = newTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            var result = await knex('movies').where({ title: title }).update({title: newTitle, 
                title_uppercase: newTitle.toUpperCase(), no_accent: no_accent})
            return result ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async editPoster(title, poster){
        var result = await knex('movies').where({title: title}).update({poster: poster});
        return result ? true : false
    }

    async moviesNumber(){
        const number = await knex('movies').count('title', { as: 'count' });
        return number
    }

    async findByTitleSearch(search){
        try {

            function removeAccents(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              }

            const searchTerm = removeAccents(search.toUpperCase());
            const movies = await knex('movies')
                                .where('no_accent', 'like', `%${searchTerm}%`)
                                .select(['id', 'title'])
                                .orderBy('title', 'asc');
            return movies
        } catch (error) {
            return error
        }
    }

    async verifyAnswer(id, answer){
        try {
            var movie = await knex.select("title_uppercase").where({id:id}).table("movies").first();
            if(movie.title_uppercase === answer.toUpperCase()){
                return true
            } else {
                return false
            }
        } catch (error) {
            return error
        }
    }

    async newRecord(id, newRecord){
        try {
            if(id){
                var user = await knex.select("record").where({id:id}).table("users").first();
                if(newRecord > user.record){
                    await knex("users").where({ id: id }).update({record: newRecord }); 
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getMeta(id){
        try {
            const meta = await knex.select("meta_score").where({id:id}).table("movies").first()
            return meta
        } catch (error) {
            return error
        }
       
    }

    async getRecords(){
        try {
            const users = await knex.select(["name", "surname", "username", "id", "record"]).table("users").orderBy("record", "desc").limit(10);
            return users
        } catch (error) {
            console.log(error)
        }   
    }

    async dailyMovie() {
        const today = DateTime.local().setZone('America/Sao_Paulo');
        const day = today.toFormat('dd');
        const month = today.toFormat('MM');
        const year = today.toFormat('yyyy');
        const todayDate = `${year}-${month}-${day}`;
        const movie = await knex.select("*").table("daily_movie").where({ date: todayDate }).first();
        return movie;
      }

    async addDailyMovie(movie){
        try {
            console.log(movie.id_movie)
            const result =  await knex.insert({
                date: movie.date,
                poster: movie.poster,
                title: movie.title,
                year: movie.year,
                runtime: movie.runtime,
                genre: movie.genre,
                meta_score: movie.metascore,
                director: movie.director,
                star1: movie.actor1,
                star2: movie.actor2,
                star3: movie.actor3,
                star4: movie.actor4,
                id_movie: movie.id_movie
              }).table("daily_movie");
              return result ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }
    
    async getAllDailyMovies() {
        const movies = await knex.select("*").from("daily_movie").orderBy("date", "desc");
        return movies;
      }
      

}

module.exports = new Movies();