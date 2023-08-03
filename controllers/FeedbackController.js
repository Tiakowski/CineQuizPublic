const Feedback = require("../models/Feedback");
const User = require("../models/User");

class FeedbackController {
    async saveProblem(req, res){
        const title = req.body.title
        const description = req.body.description
        const type = req.body.type

        const result = await Feedback.problem(title, description, type)
        if(result.status){
            res.statusCode = result.statusCode
            res.redirect("/")

        } else {
            res.statusCode = result.statusCode
            res.redirect("/")
        }

    }

    async saveSuggestion(req, res){
        const title = req.body.title
        const link = req.body.link
        const type = req.body.type

        const result = await Feedback.suggestion(title, link, type)
        if(result.status){
            res.statusCode = result.statusCode
            res.redirect("/")

        } else {
            res.statusCode = result.statusCode
            res.redirect("/")
        }

    }

    async saveNoPoster(req, res){
        const title = req.body.title
        const type = req.body.type

        const result = await Feedback.noPoster(title, type)
        if(result.status){
            res.statusCode = result.statusCode
            res.redirect("/")

        } else {
            res.statusCode = result.statusCode
            res.redirect("/")
        }

    }

    async getAllProblems(req, res){
        try {
            const problems = await Feedback.getProblems()
            res.json(problems)
        } catch (error) {
            console.log(error)
            res.statusCode(500)
        }
    }

    async getAllSuggestions(req, res){
        try {
            const suggestions = await Feedback.getSuggestions()
            res.json(suggestions)
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error');

        }
    }

    async getAllPosters(req, res){
        try {
            const posters = await Feedback.getNoPosters()
            res.json(posters)
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error');

        }
    }

    async dashboardDeleteUser(req, res){
        try {
            const role = res.locals.role
            const id = req.params.id
            const deletedUserRole = req.params.role
            await User.dashboardDeleteUser(id,role,deletedUserRole)
            res.status(200)
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    async dashboardDeleteFeedback(req, res){
        try {
            const id = req.params.id
            await Feedback.deleteFeedback(id)
            res.status(200)
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new FeedbackController()