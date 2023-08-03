var Follow = require("../models/Follow");

class FollowController{
    async followUser(req, res) {
        const userFollowing = req.userId;
        const userFollowed = req.params.username;
        try {
            const followResult = await Follow.followUser(userFollowing, userFollowed)
            if(followResult.status){
                res.redirect("/user/profile/"+userFollowed)
            } else {
            res.redirect("/")
            }
        } catch (error) {
            res.statusCode = followResult.statusCode;
            res.redirect("/")
        }
        
    }
}

module.exports = new FollowController();