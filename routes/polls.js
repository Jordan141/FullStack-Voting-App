const express = require('express')
const Poll = require('../models/Poll')
const router = express.Router()
const {isLoggedIn, checkPollOwnership} = require('../middleware')
router.get('/', (req, res) => {

    Poll.find({}, (err, polls) => {
        if(err) throw err;
        res.render('home', {polls, currentUser: req.user, page: 'polls'})
    })
})

//CREATE
router.post('/', isLoggedIn, (req, res) => {
    const {name} = req.body
    console.log('name:', name)
    const author = {id: req.user._id, username: req.user.username}
    const options = req.body.options.split(',').map(e => e.trim())//Remove trailing whitespaces
    const votes = new Array(options.length).fill(0)
    console.log(options, votes)
    Poll.create({name, options, votes, author}, err => {
        if(err) throw err;
        console.log('Created Record')
        res.redirect('/')
    })
})

//NEW - Show form to create new poll
router.get('/new', isLoggedIn, (req, res) => {
    res.render('polls/new.ejs')
})

//SHOW
router.get('/:id', (req,res) => {
    Poll.findById(req.params.id, (err, data) => {
        if(err) throw err
        res.render('polls/show', {poll: data})
    })
})

//EDIT
router.get('/:id/edit', checkPollOwnership, (req, res) => {
    Poll.findById(req.params.id, (err, poll) => {
        if(err) throw err
        res.render('polls/edit', {poll})
    })
})

//UPDATE
router.put('/:id', checkPollOwnership, (req,res) => {
    const newData = {...req.body.poll}
    Poll.findByIdAndUpdate(req.params.id, {$set: newData} , err => {
        if(err){
            throw err
        }
        req.flash("success","Successfully Updated!")
        res.redirect('/' + req.params.id)
    })

})

//DESTROY
router.delete('/:id', checkPollOwnership, (req,res) => {
    Poll.findByIdAndRemove(req.params.id, err => {
        if(err){
            return err
        }
        res.redirect('/')
    })
})


module.exports = router