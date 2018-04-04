const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const {isLoggedIn, checkCommentOwnership} = require('../middleware')

router.get('/register', (req,res) => {
    res.render('register', {page: 'register'})
})

router.post('/register', (req,res) => {
    
    let newUser = new User({
        username: req.body.username
    })

    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message)
            return res.render('register')
        }
        passport.authenticate('local')(req,res, () => {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect('/')
        })
    })
})


router.get('/login', (req,res) => {
    res.render('login', {page: 'login'})
})
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/api/login',
        failureFlash: true,
        successFlash: 'Welcome to my Voting App!'
    }
))

router.get('/logout', (req,res) => {
    req.logout()
    req.flash("success", "See you later!");
    res.redirect('/')
})

module.exports = router