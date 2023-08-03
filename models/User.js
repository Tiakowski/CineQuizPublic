var knex = require("../DAO/connection");
var bcrypt = require('bcrypt');
const util = require('util');


class User {
    async new(email, name,surname, password, username){
        const usernameUppercase = username.toUpperCase();
        try{
            if(await this.usernameExists(username)){
                return {statusCode:400 ,status: false , error: "Username já cadastrado"}
            }

            if(await this.emailExists(email)){
                return {statusCode:400 ,status: false , error: "Email já cadastrado"}
            }

            var hash = await bcrypt.hash(password, 10)
            await knex.insert({name, email, password: hash, surname, username, username_uppercase: usernameUppercase}).table("users");
            return {statusCode: 200, status: true, error: undefined}
        }catch(error){
            return {statusCode:500 ,status: false , error: "Erro interno do servidor"}
        }

    }

    async login(email, password){
        const bcryptCompare = util.promisify(bcrypt.compare);

        try{
            if(!await this.emailExists(email)){
                return {statusCode:404 ,status: false , error: "Email não encontrado!"}
            }
        }catch(error){
            console.error('Erro ao buscar usuário:', error);
            return { statusCode: 500, status: false, error: "Erro ao procurar usuário" };
        }
        

        try{
            var result = await knex.select("*").where({email:email}).table("users").first();
            const isMatch = await bcryptCompare(password, result.password);

            if(isMatch){
                return { statusCode: 200, status: true, error: null, role: result.role, id: result.id };
            } else {
                return { statusCode: 401, status: false, error: "Senha incorreta" };
            }
        }catch(error){
            console.error('Erro ao buscar usuário:', error);
            return { statusCode: 500, status: false, error: "Erro ao buscar usuário" };
        }

        
    }

    async emailExists(email){
        try{
            var existingUser = await knex.select("*").where({email: email}).table("users").first();
            return existingUser ? true : false;
        }catch(error){
            console.log(error);
            throw new Error('Erro ao verificar a existência do email');
        }
        
    }

    async usernameExists(username){
        try {
            var existingUser = await knex.select("*").where({username_uppercase: username.toUpperCase()}).table("users").first();
            return existingUser ? true : false;
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao verificar a existência do username');
        }
    }

    async findById(id){
        var result = await knex.select("*").where({id:id}).table("users").first();
        if (result){
            return result
        } else {
            return undefined;
        }
    }

    async getUsersByIds(ids){
        try {
            if(ids.length === 0){
                return null
            }
            let userIds = ids.map(row => row.user_following); // Extrai os IDs dos resultados recebidos
            if(userIds[0] === undefined){
                userIds = ids.map(row => row.user_followed); // Extrai os IDs dos resultados recebidos
            }
            const users = await knex('users').whereIn('id',userIds).select(['username', 'id', 'name', 'surname']);
            return users;
          } catch (error) {
            console.log('Erro ao buscar usuários:', error);
            throw error;
          }
    }


    async findAll(){
        try{
            var result = await knex.select([id, name, password, email]).table("users");
            return {statusCode: 200, status: true, data: result };
        }catch(error){
            return {statusCode:500, status: false, error: error}
        }
    }

    async findByUsername(username){
        var result = await knex.select("*").where({username_uppercase:username.toUpperCase()}).table("users").first();
        if (result){
            return result
        } else {
            return null;
        }
    }

    async findByUsernameSearch(search){
        try {
            const searchTerm = search.toUpperCase();
            const users = await knex('users')
                            .where('username_uppercase', 'LIKE', `${searchTerm}%`)
                            .select(['username', 'id', 'name', 'surname'])
                            .limit(10);
            return users
        } catch (error) {
            return error
        }

        
    }

    async getIdByUsername(username){
        const user = await this.findByUsername(username);
        if(user){
            return user.id;
        } else {
            return null
        }
    }

    async getAllUsers(){
        try {
            const users = await knex('users').select(['id','name','surname', 'username','role']).limit(50);
            return users
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async changeRole(id, roleChanged, userRole){
        try {
            console.log("id"+id)
            console.log("rolemudado"+roleChanged)
            console.log("userrole"+userRole)
            if(userRole > 1){
                await knex("users").where({id: id}).update({role:roleChanged}) //O dono pode alterar qualquer um pois ele é 2. (maior q 1)
            } else if (userRole == 1 && id == 0){ //O Admin pode alterar um usuario nivel 0
                await knex("users").where({id: id}).update({role:roleChanged}) 
            } else if((userRole == 1 && id > 0)) { //O admin nao pode alterar o valor de outro admin ou do dono
                console.log("Não autorizado")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async edit(id, data){
        var user = await this.findById(id);
        if(user == undefined){
            return {statusCode:404, status: false, error: "Usuário não encontrado"}
        }

        try{
            await knex("users").where({id: id}).update(data)
            return {statusCode: 200, status:true};
        } catch(error){
            return { statusCode: 500, status: false, error: "Erro interno do servidor" };
        }
    }

    async _validatePassword(inputPassword, id){
        const bcryptCompare = util.promisify(bcrypt.compare);

        var user = await knex.select("*").where({id:id}).table("users").first();
        const isMatch = await bcryptCompare(inputPassword, user.password);
        return isMatch
    }
     
    async editPassword(newPassword,newPasswordConfirmation, id){
        try{
            if(newPassword !== newPasswordConfirmation){
                return { statusCode: 422, status: false, error: "As senhas não coincidem" };
            }

            if(!newPassword || newPassword.length < 8){
                return { statusCode: 422, status: false, error: "A nova senha deve ter pelo menos 8 caracteres"}
            }

            var hash = await bcrypt.hash(newPassword, 10)
            await this.edit(id, {password: hash});
            return { statusCode: 200, status: true, error: null };
                      
        }catch(error){
            return { statusCode: 500, status: false, error: error };
        }   
    }

    async editName(name,surname, id){
        try{
            const namePattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
            if(!namePattern.test(name)){
                return { statusCode: 400, status: false, error: "Nome inválido" };
            } else if (!namePattern.test(surname)){
                return { statusCode: 400, status: false, error: "Sobrome inválido" };
            } else {
                result = await knex('users').where('id', id).update({ name, surname }) 
                if(result){
                    return { statusCode: 200, status: true, error:null };
                } else {
                    return { statusCode: 404, status: false, error:"Usuario não encontrado" };
                }
            }    
    }catch(error){
        return { statusCode: 500, status: false, error: error };
    }   
}

    async dashboardDeleteUser(id, role, deletedRole){
        try {

            if(deletedRole == 2){
                return { statusCode: 401, status: false, error: "Não pode deletar o dono." };
            }

            const userExist = await this.findById(id)
            if(userExist){
                if(role > 1){
                    await knex('users').where('id',id).delete();
                    return { statusCode: 200, status: true, error: null };
                } else if(role > deletedRole){
                    await knex('users').where('id',id).delete();
                    return { statusCode: 200, status: true, error: null };
                } else {
                    return { statusCode: 401, status: false, error: "Não autorizado" };
                }                
            } else {
                return {statusCode: 404, status: false, error: "Usuário não encontrado" };
            }
        } catch (error) {
            return {statusCode: 500, status: false, error: error};
        }
    }

    async getRole(id){
        try {
            const userExist = await this.findById(id)
            if(userExist){
                const role = await knex('users').select("role").where({id}).first()
                console.log(role)
                return role
            } else {
                return '404'
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

module.exports = new User();