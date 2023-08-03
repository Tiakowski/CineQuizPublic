const knex = require("../DAO/connection");

class Feedback{
    async problem(title, description, type){
        try {
            await knex.insert({title, description, type}).table("feedback");
            return {statusCode:200 ,status: true , error: null}
        } catch (error) {
            console.log(error)
            return {statusCode:500 ,status: true , error}
        }
    }

    async suggestion(title, link, type){
        try {
            await knex.insert({title, link, type}).table("feedback");
            return {statusCode:200 ,status: true , error: null}
        } catch (error) {
            console.log(error)
            return {statusCode:500 ,status: true , error}
        }
    }

    async noPoster(title, type){
        try {
            await knex.insert({title, type}).table("feedback");
            return {statusCode:200 ,status: true , error: null}
        } catch (error) {
            console.log(error)
            return {statusCode:500 ,status: true , error}
        }
    }
    

    async getProblems(){
        try {
            const problems = await knex.select(['id','title','description']).where('type','0').table("feedback");
            return problems
        } catch (error) {
            console.log(error)
        }
    }

    async getSuggestions(){
        try {
            const suggestions = await knex.select(['id','title','link']).where('type','1').table("feedback");
            return suggestions
        } catch (error) {
            console.log(error)
        }
    }

    async getNoPosters(){
        try {
            const noPosters = await knex.select(['id','title']).where('type', '2').table("feedback");
            return noPosters
        } catch (error) {
            console.log(error)
        }
    }

    async deleteFeedback(id){
        try {
            await knex('feedback').where('id',id).delete();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Feedback();