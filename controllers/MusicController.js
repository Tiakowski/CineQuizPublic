var Music = require("../models/Music");

class MusicController {
    async addDailyMusic(req, res){
        const music = req.body
        
        const result = await Music.addDailyMusic(music)
        if(result){
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }

    async searchSingers(req, res){
        try {
            const search = req.params.singer
            const singers = await Music.searchSinger(search)
            res.json(singers)
        } catch (error) {
            console.log(error)
        }
    }

    async getAllMusics(req, res){
        const result = await Music.getAllDailyMusics()
        res.json(result)
    }

    async deleteMusic(req, res){    
        const id = req.params.id
        console.log(id)
        const result = await Music.deleteMusic(id)
        if(result.status){
            res.sendStatus(result.statusCode)
        } else {
            res.sendStatus(result.statusCode)
            console.log(result.error)
        } 
        
    }

    async getDailyMusic(req, res){
        const music = await Music.dailyMusic()
        if(music){
            res.json(music.id)
        } else {
            res.json(null)
        }
        
    }

    async getTip(req, res){
        const id = req.params.id
        const tip = req.params.tip
        console.log(id, tip)
        const lyric = await Music.getTip(id, tip)
        res.json(lyric)
    }

    async verify(req, res){
        const id = req.params.id
        const answer = req.params.answer
        console.log(id, answer)
        const result = await Music.verifyAnswer(id, answer)
        res.json(result)
    }

    async getSinger(req, res){
        const id = req.params.id
        const result = await Music.getSinger(id)
        res.json(result)
    }

    async getTitle(req, res){
        const id = req.params.id
        const result = await Music.getTitle(id)
        res.json(result)
    }

    async getPoster(req, res){
        const id = req.params.id
        const result = await Music.getPoster(id)
        res.json(result)
        
    }

    async deleteSinger(req, res){
        const id = req.params.id
        const result = await Music.deleteSinger(id)
        res.sendStatus(result.statusCode)
    }

    async addSinger(req, res){
        const singer = req.body.singer
        const result = await Music.addMusic(singer)
        console.log(result)
        res.redirect("/dailycontrol")
    }
}

module.exports = new MusicController()