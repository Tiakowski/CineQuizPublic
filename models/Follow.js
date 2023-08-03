const knex = require("../DAO/connection");
const User = require("../models/User");

class Follow {
    async followUser(userFollowingId, userFollowed){
        const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
        if(!usernamePattern.test(userFollowed)){
            return {statusCode:400 ,status: false , error: "Usuário inválido"}
        }
        const userFollowedId = await User.getIdByUsername(userFollowed);

        if(await this.isFollowing(userFollowingId,userFollowed)){
            const result = await this.unfollowUser(userFollowingId, userFollowedId)
            if(result.status){
                return {statusCode:200 ,status: true , error: null}
            } else {
                return {statusCode:500 ,status: false , error: result.error}
            }
        }

        try {
            if(userFollowingId != null){
                await knex.insert({user_following: userFollowingId, user_followed: userFollowedId}).table("follow");
                return {statusCode:200 ,status: true , error: null}
            } else {
                return {statusCode:404 ,status: false , error: "Usuário nao encontrado"}
            }
        } catch (error) {
            return {statusCode:500 ,status: false , error: "Erro interno do servidor"}
        } 
    }

    async unfollowUser(userFollowingId, userFollowedId){
        try {
            await knex('follow')
            .where({ user_following: userFollowingId, user_followed: userFollowedId })
            .del();
            return {statusCode:200 ,status: true , error: null}
        } catch (error) {
            return {statusCode:500 ,status: false , error: "Erro interno do servidor"}
        }
        
    }

    async isFollowing(userFollowingId, userFollowed){
        const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
        if(!usernamePattern.test(userFollowed)){
            return {statusCode:400 ,status: false , error: "Usuário inválido"}
        }
        const userFollowedId = await User.getIdByUsername(userFollowed);
        try {
            const result = await knex('follow')
                .where({user_following: userFollowingId, user_followed: userFollowedId })
                .first();
            return result ? true : false
        } catch (error) {
            return {statusCode: 500, status: false, error: error };
        }

    }

    async getFollowers(userId){
        try {
            const results = await knex('follow')
              .where({ user_followed: userId })
              .select('user_following');
              return results;
          } catch (error) {
            return {statusCode: 500, status: false, error: error };
          }
    }

    async getFollowing(userId){
        try {
            const results = await knex('follow')
              .where({ user_following: userId })
              .select('user_followed');
              return results;
          } catch (error) {
            return {statusCode: 500, status: false, error: error };
          }
    }

    
}


module.exports = new Follow();