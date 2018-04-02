const express         = require('express'),
    bodyParser        = require('body-parser'),
    methodOverride    = require('method-override'),
    ejs               = require('ejs'),
    app               = express(),
    flash             = require('connect-flash'),
    PORT              = process.env.PORT || 8080

const poleRoutes = require('./routes/polls')

const localVariables = (req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
}

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(localVariables)


app.use('/', poleRoutes)

app.listen(PORT)