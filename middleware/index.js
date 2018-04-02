const Poll = require('../models/Poll')

let middlewareObj = {}

middlewareObj.checkPollOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Poll.findById(req.params.id, (err, foundPoll) => {
            if(err){
                req.flash('error', 'Poll not found')
                res.redirect('back')
            }else{
                if(foundPoll.author.id.equals(req.user._id)){
                    next()
                } else {
                    req.flash('error', 'You don\'t have permission to do that')
                    res.redirect('back')
                }
            }
        })   
    } else {
        req.flash("error", "You need to be signed in to do that!")
        res.redirect("/api/login")
    }
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','You need to be logged in to do that')
    res.redirect('/api/login')
}

module.exports = middlewareObj