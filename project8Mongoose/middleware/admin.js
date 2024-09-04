module.exports = function(req,res,next){
    /*implementing it with assumption that this will be called after 
    auth middleware and would have access to req.user */
    //401 authorization when token is invalid
    //403 forbidden when passed authorization but still have no permissions to do certain things

    if(!req.user.isAdmin){
        return res.status(403).send("Access denied")
    }

    next()
}