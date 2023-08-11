const knex = require("../DAO/connection");
const { DateTime } = require('luxon');

class Musics{
    async addDailyMusic(music){
        try {
            const result =  await knex.insert({
                date: music.date,
                title: music.title,
                singer: music.singer,
                lyrics_1: music.lyrics_1,
                lyrics_2: music.lyrics_2,
                lyrics_3: music.lyrics_3,
                lyrics_4: music.lyrics_4,
                lyrics_5: music.lyrics_5,
                lyrics_6: music.lyrics_6,
                poster: music.poster
              }).table("daily_music");
              return result ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async dailyMusic() {
        const today = DateTime.local().setZone('America/Sao_Paulo');
        const day = today.toFormat('dd');
        const month = today.toFormat('MM');
        const year = today.toFormat('yyyy');
        const todayDate = `${year}-${month}-${day}`;
        const music = await knex.select("*").table("daily_music").where({ date: todayDate }).first();
        return music;
      }

      async getAllDailyMusics() {
        const musics = await knex.select("*").from("daily_music").orderBy("date", "desc");
        return musics;
      }

      async searchSinger(searchTerm){
        try {
            const singers = await knex('singers')
                                .where('singer', 'like', `%${searchTerm}%`)
                                .select(['id', 'singer'])
                                .orderBy('singer', 'asc')
                                .limit(20);
            return singers
        } catch (error) {
            return error
        }
      }

      async deleteMusic(id){
        try {
          const result = await knex('daily_music').where({id: id}).del()
          if(result){
            return {statusCode:200, status: true, error: null}
          } else {
            return {statusCode:404, status: false, error: "Música não encontrada"}
          }
        } catch (error) {
          return {statusCode:500, status: false, error: error}
        }
      }

      async getTip(id, tip){
        try {
          var result = await knex.select([tip]).where({id:id}).table("daily_music").first();
          return result
        } catch (error) {
          
        }
      }

      async getSinger(id){
        try {
          var result = await knex.select("singer").where({id:id}).table("daily_music").first();
          return result.singer
        } catch (error) {
          
        }
      }

      async getTitle(id){
        try {
          var result = await knex.select("title").where({id:id}).table("daily_music").first();
          return result.title
        } catch (error) {
          
        }
      }

      async getPoster(id){
        try {
          var result = await knex.select("poster").where({id:id}).table("daily_music").first();
          return result.poster
        } catch (error) {
          
        }
      }

      async verifyAnswer(id, answer){
        try {
            var singer = await knex.select("singer").where({id:id}).table("daily_music").first();
            if(singer["singer"] == answer){
                return true
            } else {
                return false
            }
        } catch (error) {
            return error
        }
    }

    async deleteSinger(id){
      try {
        const result = await knex('singers').where({id: id}).del()
        if(result){
          return {statusCode:200, status: true, error: null}
        } else {
          return {statusCode:404, status: false, error: "Artista não encontrada"}
        }
      } catch (error) {
        return {statusCode:500, status: false, error: error}
      }
    }

    async addMusic(singer){
      const result = await knex.insert({singer}).table("singers")
      return result ? true : false
    }
}

module.exports = new Musics();