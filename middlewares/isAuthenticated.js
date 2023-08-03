const isAuthenticated = (req, res, next) => {
    if (res.locals.isAuthenticated) {
       next()
      } else {
        res.redirect("/user/login")
      }
    
    };


    module.exports = isAuthenticated;